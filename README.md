# OnSide – Financial Expense Tracker 💸

OnSide is a full-stack financial expense tracking web application designed to help users track, manage, and analyze their daily expenses in a simple and intuitive way.

The project uses a **Django backend** for handling APIs and data storage, and a **modern frontend** built with **Vite and Tailwind CSS**.

---

## 📂 Project Structure

```bash
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
│
├── onside_logo.png
└── README.md
```

---

## 🚀 Features

- Track daily expenses  
- Categorize expenses by type  
- Clean and minimal user interface  
- Fast and responsive frontend  
- REST-based backend architecture  
- Scalable full-stack design  

---

## 🛠 Tech Stack

### Frontend
- Vite  
- JavaScript  
- Tailwind CSS  
- HTML  

### Backend
- Python  
- Django  
- SQLite (default database)  

---

## ⚙️ Backend Setup (Django)

```bash
cd onside/backend
python -m venv venv
```

### Activate virtual environment

**Windows**
```bash
venv\Scripts\activate
```

**macOS / Linux**
```bash
source venv/bin/activate
```

### Install dependencies
```bash
pip install -r requirements.txt
```

### Apply migrations
```bash
python manage.py migrate
```

### Run backend server
```bash
python manage.py runserver
```

Backend will run at:
```
http://127.0.0.1:8000/
```

---

## 🌐 Frontend Setup

```bash
cd onside/frontend
npm install
npm run dev
```

Frontend will run at:
```
http://localhost:5173/
```

---

## 🔮 Future Improvements

- User authentication and authorization  
- Expense analytics and visual charts  
- Monthly budgets and spending limits  
- Cloud database integration  
- Deployment using Docker and cloud platforms  

---

## 👤 Author

**Hemant Kumar**  
Software Engineering Student  

---

## 📄 License

This project is intended for educational and personal use only.
