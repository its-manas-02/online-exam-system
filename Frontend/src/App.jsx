import React from 'react'
import Home from './pages/Home'
import Navbar from './components/navbar'
import Register from './pages/Register'
import Login from './pages/login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const route = createBrowserRouter([
  {
    path: '/',
    element: 
    <div className="app-container">
      <Navbar />
      <Home />
    </div>
  },
  {
    path: '/register',
    element: 
    <div >
      <Navbar />
      <Register />
    </div>
  },
  {
    path: '/login',
    element: 
    <div >
      <Navbar />
      <Login />
    </div>
  },
  {
    path: '/dashboard',
    element: 
    <ProtectedRoute>
      <Navbar />
      <Dashboard />
    </ProtectedRoute>
  },
])
function App() {
  return (
    <div>
      <RouterProvider router={route}></RouterProvider>
    </div>
  )
}

export default App
