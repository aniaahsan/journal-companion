import os
import psycopg2
import psycopg2.pool

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
