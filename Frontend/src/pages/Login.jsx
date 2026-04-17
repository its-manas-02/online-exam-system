import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import bgImage from "../assets/bg.jpg"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [form, setForm] = React.useState({
    key:"",
    password: "",
  });
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("submit cllicked")
    // Handle form submission logic here
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      localStorage.setItem("token", data.token);
      login(data.user);
      console.log("Redirecting to dashboard...");
      navigate("/dashboard");
      console.log("Success:", data);
      setError(""); // clear error
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className='flex items-center justify-end h-screen bg-no-repeat bg-cover ' 
        style={{backgroundImage: `URL(${bgImage})`, backgroundPosition: "center right"}}>
      
      <div className="flex items-center justify-center w-1/3 h-full px-2 backdrop-blur-md"
      >
        
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="flex items-center gap-4">
            <label htmlFor="key" className="w-24">Email or phone no:</label>
            <input
              type="text"
              id="key"
              name="key"
              onChange={handleChange}
              className="w-64 px-2 py-1 border-2 border-black rounded-md"
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="password" className="w-24">Password:</label>
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                onChange={handleChange}
                className="w-64 px-2 py-1 border-2 border-black rounded-md"
                minLength={8}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-600 -translate-y-1/2 cursor-pointer right-2 top-1/2 hover:text-black"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          
          <div className="flex justify-center">
            <button type='submit' className="px-4 py-1 text-white bg-blue-600 rounded-md " disabled = {loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
      
    </div>
  )
}