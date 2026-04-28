// Frontend/src/components/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState(false);
  const menuRef = React.useRef(null);

  // Close sidebar on Escape key
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Close profile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handelclick = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Dynamic avatar color
  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-indigo-500"];
  const color = user?.username 
    ? colors[user.username.charCodeAt(0) % colors.length] 
    : "bg-gray-500";

  const handleLogout = () => {
    logout();           // AuthContext se logout
    setOpenMenu(false);
    navigate("/login");
  };

  return (
    <>
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 py-2 text-white bg-blue-700">
        <div className="text-2xl cursor-pointer" onClick={handelclick}>
          <FontAwesomeIcon icon={faBars} />
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={menuRef}>
              <span 
                className={`flex items-center justify-center w-10 h-10 text-white font-semibold rounded-full cursor-pointer ${color}`}
                onClick={() => setOpenMenu(prev => !prev)}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </span>

              {openMenu && (
                <div className="absolute right-0 z-50 w-48 py-1 mt-2 text-black bg-white rounded-lg shadow-lg">
                  <div 
                    onClick={() => {
                      setOpenMenu(false);
                      navigate("/user/profile");
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    Profile
                  </div>
                  <div 
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-600 cursor-pointer hover:bg-gray-100"
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NavLink 
              to="/login" 
              className="px-5 py-2 font-medium transition bg-green-500 rounded-lg hover:bg-green-600"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>

      {/* Secondary Menu */}
      {user && (
        <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto text-sm bg-gray-100 border-b">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `px-4 py-2 rounded-md transition ${isActive ? 'bg-white shadow font-medium' : 'hover:bg-white'}`}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/ranking" 
            className={({ isActive }) => `px-4 py-2 rounded-md transition ${isActive ? 'bg-white shadow font-medium' : 'hover:bg-white'}`}
          >
            Ranking
          </NavLink>
          <NavLink 
            to="/results" 
            className={({ isActive }) => `px-4 py-2 rounded-md transition ${isActive ? 'bg-white shadow font-medium' : 'hover:bg-white'}`}
          >
            Results
          </NavLink>
          <NavLink 
            to="/add-quiz" 
            className={({ isActive }) => `px-4 py-2 rounded-md transition ${isActive ? 'bg-white shadow font-medium' : 'hover:bg-white'}`}
          >
            Add Quiz
          </NavLink>
          <NavLink 
            to="/my-quiz" 
            className={({ isActive }) => `px-4 py-2 rounded-md transition ${isActive ? 'bg-white shadow font-medium' : 'hover:bg-white'}`}
          >
            My Quiz
          </NavLink>
        </div>
      )}

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-72 bg-white shadow-2xl p-5 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
          <button onClick={closeSidebar} className="text-2xl text-gray-600">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <nav className="space-y-1">
          <NavLink 
            to="/dashboard" 
            onClick={closeSidebar}
            className={({ isActive }) => `block px-4 py-3 rounded-lg text-lg ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'}`}
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            onClick={closeSidebar}
            className={({ isActive }) => `block px-4 py-3 rounded-lg text-lg ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'}`}
          >
            About
          </NavLink>
          <NavLink 
            to="/support" 
            onClick={closeSidebar}
            className={({ isActive }) => `block px-4 py-3 rounded-lg text-lg ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'}`}
          >
            Support
          </NavLink>
        </nav>
      </div>
    </>
  );
}