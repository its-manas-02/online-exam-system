# 🚀 Online Exam System (MERN Stack)

A full-stack web application for conducting online exams and quizzes with secure JWT authentication and role-based access control. Built to simulate a real-world exam platform with clean, responsive UI and scalable architecture.

---

## ✨ Key Features

- 🔐 **Secure JWT Authentication** – Register and Login
- 👥 **Role-Based Access Control** – Admin, Teacher, and Student roles
- 📝 **Dynamic Quiz Creation** – Create topics, quizzes with multiple questions
- ❓ **Multiple Choice Questions** – Each question with 4 options and one correct answer
- 🎨 **Modern Responsive UI** – Built with Tailwind CSS
- 🛡️ **Protected Routes** – Secure frontend routing with React Router
- 🧱 **MVC Architecture** – Clean and maintainable backend structure

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **React Router DOM**
- **Tailwind CSS**

### Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **bcryptjs** – Password hashing

---

## 📂 Project Structure

```bash
online-exam-system/
├── Backend/
│   ├── config/            # Database configuration
│   ├── controllers/       # Business logic (authController, quizController)
│   ├── middleware/        # Authentication & authorization middleware
│   ├── models/            # Mongoose schemas (User, Topic, Quiz, Question)
│   ├── routes/            # Modular route files (authRoutes, quizRoutes)
│   └── server.js          # Server entry point
│
├── Frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main pages (Login, TopicPage, QuizPage, etc.)
│   │   ├── layouts/       # Layout components
│   │   ├── routes/        # React Router configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
│
├── README.md
└── .env.example

---

⚙️ Features in Detail
🔐 Authentication

* Secure user registration and login
* Password hashing using bcryptjs
* JWT token-based authentication

👨‍💼 Role-Based System

* Admin → Full platform management
* Teacher → Create and manage quizzes
* Student → Attempt quizzes

📝 Quiz Module

* Add quizzes under specific topics
* Dynamic form to add multiple questions
* Each question supports 4 options with correct answer selection
* Proper separation of Topic, Quiz, and Question models

---

🚀 How It Works

textFrontend (React + Tailwind CSS)
        ↓ (API Calls using fetch/axios)
Backend Routes (Express.js)
        ↓
Controllers (Business Logic)
        ↓
MongoDB Database (Mongoose)

---

🧩 Challenges Solved

* Handling dynamic forms for adding multiple questions at once
* Implementing secure JWT authentication flow
* Structuring scalable backend using MVC pattern
* Managing nested routes and protected routes in React
* Proper data modeling for Topics, Quizzes, and Questions

---

🛣️ Future Enhancements

* ⏱️ Timer-based exams with auto-submission
* 📊 Real-time scoring and detailed result system
* 🏆 Leaderboard and performance analytics
* 📄 Certificate generation after completing quiz
* 📈 Teacher analytics dashboard
* 📋 Quiz attempt history for students

---

👨‍💻 Author
Manas Ghosh

---

⭐ Why This Project Matters
This project demonstrates:

Strong full-stack development skills using MERN stack
Real-world authentication and authorization flows
Dynamic form handling and complex state management
Clean, maintainable, and scalable project architecture
Seamless integration between React frontend and Express backend

