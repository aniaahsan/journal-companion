# journal-companion

link to youtube video presentation: https://www.youtube.com/watch?v=Jp9Qcpw21w0


to run: 
1. Clone and setup
```bash
git clone <your-repo-url>
cd <your-repo>
cp .env.example .env
 
2. Run
docker compose up -d --build

3. Open
Frontend: http://localhost:5173
command: npm run dev

API docs: http://localhost:8000/docs

Database: postgres://journal_user:journal_pass@localhost:5432/journaling_app


Demo login:
Username: user1
Password: journal1

For AI Integration(create your own key at Groq):
in .env put
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.1-8b-instant