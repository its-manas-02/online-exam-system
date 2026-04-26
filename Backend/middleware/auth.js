import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if authorization header exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false,
        message: "Access denied. No token provided." 
      });
    }

    const token = authHeader.split(" ")[1];

    // Extra safety check
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Access denied. No token provided." 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = decoded;   // yahan user id + jo bhi tumne sign kiya tha

    next();

  } catch (error) {
    // Handle different types of JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        message: "Token has expired. Please login again." 
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token." 
      });
    }

    // Unknown error
    console.error("Auth Error:", error);
    return res.status(401).json({ 
      success: false,
      message: "Authentication failed." 
    });
  }
};