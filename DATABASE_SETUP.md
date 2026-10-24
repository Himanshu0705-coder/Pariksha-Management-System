# PostgreSQL Setup (Step by Step)

1. PostgreSQL install karo (https://www.postgresql.org/download/) - install ke time `postgres` user ka password yaad rakho.
2. Database banao:
   - pgAdmin me: Databases -> Create -> Database -> name: `exam_paper_system`
   - ya terminal: `psql -U postgres -c "CREATE DATABASE exam_paper_system;"`
3. Backend setup:
   ```
   cd backend
   npm install
   copy .env.example .env     (Mac/Linux: cp .env.example .env)
   ```
   `.env` me `DB_PASSWORD` aur `JWT_SECRET` apna daalo.
4. Tables + admin banao: `npm run db:init`
5. Server chalao: `npm start`
6. Browser me kholo: http://localhost:3000   (Live Server / file:// se mat kholna)

Default admin: username `admin` / password `admin123` (login ke baad Settings se change kar lo).

## Update (departments + folders)
Purane project par ye update lagane ke baad:
1. `cd backend` -> `npm run db:init`  (naye tables/columns add honge, purana data safe rehta hai)
2. `npm start`
3. Admin login -> Departments me apne departments check/add karo
4. Purane papers ko "Exam papers -> Library" me edit (pencil) karke department assign karo, warna students ko nahi dikhenge.
