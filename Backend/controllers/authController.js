// Backend/controllers/authController.js
import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Check if email already exists
    const existingemail = await User.findOne({email : email});
    if (existingemail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Check if phone already exists
    const existingphone = await User.findOne({phone : phone});
    if (existingphone) {
      return res.status(400).json({
        message: "Phone No already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const newUser = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
    });

        // 🔥 create token
    const token = jwt.sign(
      { id: newUser._id },
      JWT_SECRET,
      { expiresIn: "1h" } // remember me duration
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      },
    });


  } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
            message: "Email already exists"
            });
        }

        res.status(500).json({
            message: "Server error",
        });
  }
};

export const login = async (req, res) => {
  try {
    const { key, password } = req.body;

    // 🔥 find user (email OR phone)
    const user = await User.findOne({
      $or: [
        { email: key },
        { phone: key }
      ]
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "wrong password",
      });
    }

    // 🔥 create token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" } // remember me duration
    );
    
    res.status(200).json({
      message: `Welcome back, ${user.username}`,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};