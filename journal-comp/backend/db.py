import os
import psycopg2
import psycopg2.pool
from typing import Optional, List, Dict, Any

DB = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "5432")),
    "dbname": os.getenv("DB_NAME", "journaling_app"),
    "user": os.getenv("DB_USER", "journal_user"),
    "password": os.getenv("DB_PASSWORD", "journal_pass"),
}

pool: psycopg2.pool.SimpleConnectionPool | None = None

def init_pool():
    global pool
    if pool is None:
      pool = psycopg2.pool.SimpleConnectionPool(
          minconn=1, maxconn=5, **DB
      )

def query(sql: str, params: tuple = ()):
    if pool is None:
        init_pool()
    conn = pool.getconn()
    try:
        with conn, conn.cursor() as cur:
            cur.execute(sql, params)
            if cur.description:
                return cur.fetchall()
            return None
    finally:
        pool.putconn(conn)

def get_entries(user_id: str, limit: int = 20, offset: int = 0):
    sql = """
      SELECT id, title, content, mood, tags, is_private, created_at
      FROM journal_entries
      WHERE user_id = %s
      ORDER BY created_at DESC
      LIMIT %s OFFSET %s
    """
    rows = query(sql, (user_id, limit, offset))
    return [
      {
        "id": r[0], "title": r[1], "content": r[2],
        "mood": r[3], "tags": r[4] or [], "is_private": r[5],
        "created_at": r[6].isoformat()
      }
      for r in rows or []
    ]

def insert_entry(user_id: str, title: str, content: str, mood: str | None, tags: list[str], is_private: bool):
    sql = """
      INSERT INTO journal_entries (user_id, title, content, mood, tags, is_private)
      VALUES (%s, %s, %s, %s, %s, %s)
      RETURNING id, created_at
    """
    rows = query(sql, (user_id, title, content, mood, tags, is_private))
    r = rows[0]
    return {"id": r[0], "created_at": r[1].isoformat()}


def get_user_by_username(username: str) -> Optional[dict]:
    row = query(
        "SELECT id, username, hashed_password FROM users WHERE username = %s",
        (username,),
    )
    if not row:
        return None
    r = row[0]
    return {"id": r[0], "username": r[1], "hashed_password": r[2]}

def get_user_by_id(user_id: str) -> Optional[dict]:
    row = query(
        "SELECT id, username, hashed_password FROM users WHERE id = %s",
        (user_id,),
    )
    if not row:
        return None
    r = row[0]
    return {"id": r[0], "username": r[1], "hashed_password": r[2]}

def insert_user(username: str, hashed_password: str) -> dict:
    rows = query(
        """
        INSERT INTO users (username, hashed_password)
        VALUES (%s, %s)
        RETURNING id, username
        """,
        (username, hashed_password),
    )
    r = rows[0]
    return {"id": r[0], "username": r[1]}

from typing import Optional, List, Dict, Any

def insert_checkin(
    user_id: str,
    mood_score: int,
    stress: int,
    energy: int,
    struggles: List[str],
    note: Optional[str],
) -> Dict[str, Any]:
    rows = query(
        """
        INSERT INTO checkins (user_id, mood_score, stress, energy, struggles, note)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id, created_at
        """,
        (user_id, mood_score, stress, energy, struggles, note),
    )
    r = rows[0]
    return {"id": r[0], "created_at": r[1].isoformat()}

def get_checkins(user_id: str, limit: int = 200, offset: int = 0) -> List[Dict[str, Any]]:
    rows = query(
        """
        SELECT id, created_at, mood_score, stress, energy, struggles, note
        FROM checkins
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT %s OFFSET %s
        """,
        (user_id, limit, offset),
    ) or []
    out = []
    for r in rows:
        out.append({
            "id": r[0],
            "created_at": r[1].isoformat(),
            "moodScore": r[2],
            "stress": r[3],
            "energy": r[4],
            "struggles": r[5] or [],
            "note": r[6],
        })
    return out
