import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

/**
 * Register a new user
 */
export const register = async (req, res) => {
  const { email, password, firstName = "", lastName = "" } = req.body; // <-- accept names here
  try {
    if (!email || !password || !firstName) // require first name for best UX
      return res.status(400).json({ message: "Fill in all the fields" });

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- Add first and last name here ---
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName, // NEW: stores the first name
      lastName,  // NEW: stores the last name (optionally blank)
    });

    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res); // Set JWT in HTTP-only cookie

      res.status(200).json({
        _id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName, // <-- return for frontend
        lastName: newUser.lastName,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in Register Controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * User login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res); // Set JWT in HTTP-only cookie

    res.status(200).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName, // <-- return for frontend
      lastName: user.lastName,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * User logout - clears JWT cookie
 */
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0, httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV !== "development" });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Check if user is authenticated (used for ProtectedRoute on frontend)
 */
export const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    // Optionally return minimal user info to frontend
    res.status(200).json({
      message: "Authorized",
      user: {
        _id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName, // <-- always add these
        lastName: req.user.lastName,
      },
    });
  } catch (error) {
    console.error("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
