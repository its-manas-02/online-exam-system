import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import bgImage from "../assets/bg.jpg"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from '../config/api';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);
    
  const [form, setForm] = React.useState({
    username: "",
    email: "",
    phone: "",
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
     
    const usernameRegex = /^[A-Za-z]+$/;
    const passwordRegex = /^[A-Za-z0-9@#$&!?/_*%]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!usernameRegex.test(form.username)) {
      return setError("Username must contain only letters");
    }
    if (!passwordRegex.test(form.password)) {
      return setError("Password must contain only letters, numbers, and special characters");
    }
    if (!phoneRegex.test(form.phone)) {
      return setError("Phone number must contain exactly 10 digits");
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Server did not return valid JSON");
      }

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
      {/* <img src={bgImage} alt="Background" /> */}
      <div className="flex items-center justify-center w-1/3 h-full px-2 backdrop-blur-md"
      >
        <form className="space-y-4" onSubmit={handleSubmit} >

          <div className="flex items-center gap-4">
            <label htmlFor="username" className="w-24">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={handleChange}
              className="w-64 px-2 py-1 border-2 border-black rounded-md"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="email" className="w-24">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              className="w-64 px-2 py-1 border-2 border-black rounded-md"
              required
            />
          </div>
          
          <div className='flex items-center gap-4'>
            <label htmlFor="phone" className="w-24">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
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
            <button type='submit' className="px-4 py-1 text-white bg-blue-600 rounded-md" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Register




// import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import Register from './Register';
import Login from './Login';

// function Register() {
//   const [isLogin, setIsLogin] = React.useState(true);
//   const [showPassword, setShowPassword] = React.useState(false);
//   const [error, setError] = React.useState("");

//   const [form, setForm] = React.useState({
//     username: "",
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isLogin) {
//       console.log("Login Data:", form);
//       // call login API
//     } else {
//       console.log("Register Data:", form);
//       // call register API
//     }
    
//     try {
//       const response = await fetch("http://localhost:5000/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(form),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Something went wrong");
//       }

//       console.log("Success:", data);
//       setError(""); // clear error
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="flex justify-center mt-10">
//       <div className="p-6 border rounded-lg shadow-md w-80">

//         {/* Toggle */}
//         <div className="flex justify-between mb-4">
//           <button
//             onClick={() => setIsLogin(true)}
//             className={`w-1/2 py-1 ${isLogin ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//           >
//             Login
//           </button>
//           <button
//             onClick={() => setIsLogin(false)}
//             className={`w-1/2 py-1 ${!isLogin ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//           >
//             Register
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-3">

//           {/* Username (only register) */}
//           {!isLogin && (
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               onChange={handleChange}
//               className="w-full px-2 py-1 border rounded"
//               required
//             />
//           )}

//           {/* Email */}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             onChange={handleChange}
//             className="w-full px-2 py-1 border rounded"
//             required
//           />

//           {/* Password with eye */}
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               onChange={handleChange}
//               className="w-full px-2 py-1 pr-10 border rounded"
//               required
//             />

//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute -translate-y-1/2 cursor-pointer right-2 top-1/2"
//             >
//               <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
//             </span>
//           </div>
//           {error && <p className="text-red-500">{error}</p>}

//           {/* Submit */}
//           <button className="w-full py-1 text-white bg-blue-600 rounded">
//             {isLogin ? "Login" : "Register"}
//           </button>
//         </form>

//         {/* Switch link */}
//         <p className="mt-3 text-sm text-center">
//           {isLogin ? "Don't have an account?" : "Already have an account?"}
//           <span
//             onClick={() => setIsLogin(!isLogin)}
//             className="ml-1 text-blue-600 cursor-pointer"
//           >
//             {isLogin ? "Register" : "Login"}
//           </span>
//         </p>

//       </div>
//     </div>
//   );
// }

// export default Register;