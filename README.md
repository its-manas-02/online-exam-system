# 🚀 Online Exam System (MERN Stack)

A full-stack web application for conducting online exams with secure authentication and role-based access control. Built to simulate a real-world exam platform with scalable architecture and a clean, responsive UI.

---

## 📂 Project Structure

```
online-exam-system/
│
├── Backend/
│   ├── config/            # Database configuration
│   ├── controllers/       # Business logic (auth, quiz)
│   ├── middleware/        # Auth & role middleware
│   ├── models/            # Mongoose schemas (User, Question, Topic)
│   ├── routes/            # API routes
│   └── server.js          # Entry point
│
├── Frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI (Navbar, ProtectedRoute)
│   │   ├── pages/         # Pages (Home, Login, Dashboard, AddQuiz)
│   │   ├── layouts/       # Layouts (MainLayout)
│   │   ├── routes/        # Routing configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── index.html
│
└── README.md
```

---

## 🧠 Key Highlights

* 🔐 JWT-based authentication (Login/Register)  
* 👥 Role-based access control (Admin / Teacher / Student)  
* 📝 Dynamic quiz creation with multiple questions and options  
* 🧱 MVC backend architecture (controllers, routes, models)  
* ⚛️ Structured React frontend with protected routes  
* 🎨 Responsive UI using Tailwind CSS  

---

## 🛠️ Tech Stack

**Frontend**

* React (Vite)  
* React Router DOM  
* Tailwind CSS  

**Backend**

* Node.js + Express  
* MongoDB + Mongoose  
* JWT Authentication  
* bcryptjs  

---

## ⚙️ Features

### 🔐 Authentication

* Secure user registration & login  
* Password hashing with bcrypt  
* Token-based session handling  

### 👨‍💼 Role-Based System

* **Admin** → manage platform  
* **Teacher** → create quizzes  
* **Student** → attempt quizzes  

### 📝 Quiz Module

* Add quizzes by topic  
* Each question has 4 options  
* Correct answer selection  
* Scalable question structure  

---

## 📈 Flow Diagram

```
Frontend (React)
   ↓
API Calls (fetch)
   ↓
Backend Routes (Express)
   ↓
Controllers (Business Logic)
   ↓
MongoDB (Database)
```

---

## 🧩 Challenges Solved

* Handling dynamic forms for multiple questions  
* Implementing secure authentication with JWT  
* Structuring a scalable backend using MVC  
* Managing protected routes in React  

---

## 🚀 Future Enhancements

* 📊 Result & scoring system  
* ⏱️ Timer-based exams  
* 📈 Analytics dashboard  
* 🧾 Quiz attempt history  

---

## 👨‍💻 Author

**Manas Ghosh**

---

## ⭐ Why This Project Matters

This project demonstrates:

* Full-stack development skills  
* Real-world authentication flows  
* Scalable, maintainable project structure  
* Clean integration of frontend UI with backend logic

