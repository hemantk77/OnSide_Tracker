# OnSide – Financial Expense Tracker 💸

OnSide is a full-stack financial expense tracking web application designed to help users monitor, manage, and understand their spending habits in a simple and intuitive way.

The project uses a **Django backend** for APIs and data handling, and a **modern frontend** built with **Vite, Tailwind CSS, and JavaScript**.

---

## 📂 Project Structure

OnSide_Tracker/
├── onside/
│   ├── backend/
│   │   ├── manage.py
│   │   ├── requirements.txt
│   │   ├── db.sqlite3
│   │   ├── backend/
│   │   │   ├── __init__.py
│   │   │   ├── asgi.py
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   └── wsgi.py
│   │   └── venv/
│   │
│   ├── frontend/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   └── src/
│   │       ├── main.js
│   │       └── styles.css
│   │
├── onside_logo.png
└── README.md

---

## 🚀 Features

- Track daily expenses
- Categorize spending
- Clean and minimal UI
- Fast frontend using Vite
- REST-based backend with Django
- Scalable full-stack architecture

---

## 🛠 Tech Stack

### Frontend
- Vite
- JavaScript
- Tailwind CSS
- HTML
- ESLint

### Backend
- Python
- Django
- SQLite (default database)

---

## ⚙️ Backend Setup (Django)

### 1. Navigate to backend directory
```bash
cd onside/backend
*Windows*
python -m venv venv
venv\Scripts\activate

*macOS / Linux*
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver

Backend will run at: http://127.0.0.1:8000/

*### 1. Navigate to Frontend directory*
cd onside/frontend

npm install

npm run dev

Frontend will run at: http://localhost:5173/

The application logo is available as: onside_logo.png

🔮 Future Improvements

User authentication & profiles

Expense analytics & charts

Monthly budgets and goals

Cloud database integration

Deployment using Docker / Vercel / AWS

👤 Author

Hemant Kumar
Software Engineering Student

---
