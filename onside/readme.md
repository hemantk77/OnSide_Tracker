OnSide Finance: Django + React Integration Guide

This guide will walk you through setting up a professional "Decoupled" architecture where React (Frontend) and Django (Backend) run as separate services that talk to each other.

Phase 1: Project Structure Setup

Create a main root folder for your entire project.

mkdir onside-finance
cd onside-finance


Inside this folder, you will eventually have:

/backend (Django Code)

/frontend (React Code)

Phase 2: Setting up the Django Backend

1. Create the Environment

It is best practice to use a virtual environment.

# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate


2. Install Dependencies

You need Django, Django REST Framework (for the API), and CORS Headers (to allow React to talk to Django).

pip install django djangorestframework django-cors-headers psycopg2-binary


(Note: psycopg2-binary is for PostgreSQL, as requested in your SRS).

3. Initialize the Project

django-admin startproject backend
cd backend
python manage.py startapp api


4. Configure settings.py

Open backend/backend/settings.py and make these changes:

A. Add Installed Apps:

INSTALLED_APPS = [
    # ... existing apps ...
    'rest_framework',
    'corsheaders',
    'api',
]


B. Add Middleware:
Add CorsMiddleware above CommonMiddleware:

MIDDLEWARE = [
    # ...
    'corsheaders.middleware.CorsMiddleware', # Add this
    'django.middleware.common.CommonMiddleware',
    # ...
]


C. Configure CORS:
At the bottom of the file, allow your React app (usually running on port 5173 with Vite) to connect.

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]


5. Create Models (Matching your React Data)

In backend/api/models.py, define the structures for Transactions and Goals.

from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    TRANSACTION_TYPES = [('income', 'Income'), ('expense', 'Expense')]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    category = models.CharField(max_length=100)
    date = models.DateField()

    def __str__(self):
        return f"{self.title} - {self.amount}"

class SavingsGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2)
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    icon = models.CharField(max_length=10, default="💰")


6. Create Serializers

Create a file backend/api/serializers.py:

from rest_framework import serializers
from .models import Transaction, SavingsGoal

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class SavingsGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavingsGoal
        fields = '__all__'


7. Create Views

In backend/api/views.py:

from rest_framework import viewsets
from .models import Transaction, SavingsGoal
from .serializers import TransactionSerializer, SavingsGoalSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class SavingsGoalViewSet(viewsets.ModelViewSet):
    queryset = SavingsGoal.objects.all()
    serializer_class = SavingsGoalSerializer


8. Set up URLs

In backend/backend/urls.py:

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import TransactionViewSet, SavingsGoalViewSet

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet)
router.register(r'goals', SavingsGoalViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]


Phase 3: Setting up the React Frontend

Now, let's place the code I generated for you.

1. Initialize Vite (In the root onside-finance folder)

Open a new terminal (keep the Django one running or open a new tab). Go back to the root folder.

npm create vite@latest frontend -- --template react
cd frontend
npm install


2. Install Required Libraries

Your app uses Lucide Icons and needs Tailwind CSS.

npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


3. Configure Tailwind

Open frontend/tailwind.config.js and update the content array so Tailwind scans your files:

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


Add the Tailwind directives to frontend/src/index.css (delete the existing content):

@tailwind base;
@tailwind components;
@tailwind utilities;


4. Place Your Code

This is the most critical step.

Copy the entire code from the OnSideApp.jsx file I generated.

Go to frontend/src/.

Delete the existing App.jsx and App.css.

Create a new file named App.jsx.

Paste my code into App.jsx.

Important Modification:
At the very bottom of the pasted code, ensure the export is default:

export default OnSideApp;


(My generated file already does this).

In frontend/src/main.jsx, make sure it imports App correctly:

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


Phase 4: Running the Full Stack

You now have two servers to run.

Terminal 1 (Backend):

cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver


Your API is now live at http://127.0.0.1:8000/api/.

Terminal 2 (Frontend):

cd frontend
npm run dev


Your App is now live at http://localhost:5173.

You will see the UI I created running in the browser! Currently, it uses the INITIAL_DATA constant inside the React file. To make it "real," you would replace those constants with fetch('http://127.0.0.1:8000/api/transactions/') calls inside a useEffect hook.