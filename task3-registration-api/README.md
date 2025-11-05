### **Task 3 — User Registration & Validation API**
  - All fields required  
  - Email format  
  - Password ≥ 6 chars  
  - Phone must contain digits only (7–15)  
### **Task 3 — User Registration & Validation API**

- Frontend (HTML + CSS + JS) communicates with Node.js + Express + MySQL backend
- Validates inputs:
  - All fields required
  - Email format
  - Password ≥ 6 chars
  - Phone must contain digits only (7–15)
- Passwords hashed with **bcrypt** before storage
- Data stored in MySQL table `users`

**Run (backend):**

```bash
cd task3-registration-api/backend
npm install
cp .env    # fill in your MySQL credentials
node server.js
```

**Run (frontend):**

Open `task3-registration-api/frontend/index.html` in browser (it POSTs to http://localhost:4000).

Database setup: run db-setup.sql in MySQL before starting.