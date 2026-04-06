// Frontend/src/components/Navbar
import React from 'react'
import { NavLink , useNavigate , Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from "../context/AuthContext";
  
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  function handelclick() {
    setIsSidebarOpen(prev => !prev)
  }

  function closeSidebar() {
    setIsSidebarOpen(false)
  }

  return (
    <>
      {/* Top Navbar */}
      <div className='flex items-center justify-between px-2 text-white bg-blue-700 text-2 xl'>
        <div className='cursor-pointer' onClick={handelclick}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        
        <div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span>{user.username}</span>
                <button onClick={() => {
                    logout();
                    navigate("/login");
                  }} className="px-2 py-1 text-white bg-red-500 rounded">Logout</button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="px-2 py-1 text-white bg-green-500 rounded"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Menu */}
      {user?.role !== "admin" && (
        <div className="flex items-start justify-start bg-gray-300">
          <Link to="/dashboard" className="px-4 text-black transition duration-200 rounded cursor-pointer hover:text-sky-700 hover:border hover:border-black hover:shadow-md hover:-translate-x-0.5" >Dashboard</Link>
          <Link to="/ranking" className="px-4 text-black transition duration-200 rounded cursor-pointer hover:text-sky-700 hover:border hover:border-black hover:shadow-md hover:-translate-x-0.5" >Ranking</Link>
          <Link to="/results" className="px-4 text-black transition duration-200 rounded cursor-pointer hover:text-sky-700 hover:border hover:border-black hover:shadow-md hover:-translate-x-0.5" >Results</Link>
          {/* {user?.role === "teacher" && ( */}
            <Link to="/add-quiz" className="px-4 text-black transition duration-200 rounded cursor-pointer hover:text-sky-700 hover:border hover:border-black hover:shadow-md hover:-translate-x-0.5" >Add Quiz</Link>
           {/* )} */}
        </div>
        )}
      
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-72 bg-white p-4 shadow-xl transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold'>Menu</h2>
          <button className='text-xl cursor-pointer' onClick={closeSidebar} aria-label='Close menu'>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <nav className='space-y-2'>
          <NavLink to='/' className={({ isActive }) => `block rounded-md px-3 py-2 text-lg transition duration-200 ${ isActive ? 'bg-blue-100 text-blue-800 shadow' : 'hover:bg-gray-100 hover:shadow-md' }` } onClick={closeSidebar} >Home</NavLink>
          <NavLink to='/about' className={({ isActive }) => `block rounded-md px-3 py-2 text-lg transition duration-200 ${ isActive ? 'bg-blue-100 text-blue-800 shadow' : 'hover:bg-gray-100 hover:shadow-md' }` } onClick={closeSidebar} >About</NavLink>
          <NavLink to='/support' className={({ isActive }) => `block rounded-md px-3 py-2 text-lg transition duration-200 ${ isActive ? 'bg-blue-100 text-blue-800 shadow' : 'hover:bg-gray-100 hover:shadow-md' }` } onClick={closeSidebar} >Support</NavLink>
        </nav>
      </div>
      
    </>
  )
}