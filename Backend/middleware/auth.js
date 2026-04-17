import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  // if (!token) {
  //   return res.status(401).json({ message: "No token" });
  // }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 👈 now we have user id
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};