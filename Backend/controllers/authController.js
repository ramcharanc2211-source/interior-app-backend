const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getAuth } = require("firebase-admin/auth");

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("JWT_SECRET is missing from .env");
}

// REGISTER
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

// GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "Firebase ID token is required",
      });
    }

    // Verify Firebase ID token
    const decodedToken = await getAuth().verifyIdToken(idToken);

    const firebaseUid = decodedToken.uid;
    const email = decodedToken.email;
    const name =
      decodedToken.name ||
      decodedToken.email?.split("@")[0] ||
      "Google User";

    if (!email) {
      return res.status(400).json({
        message: "Google account email was not received",
      });
    }

    // Find existing user by Firebase UID
    let user = await User.findOne({
      firebaseUid,
    });

    // If not found, check existing account by email
    if (!user) {
      user = await User.findOne({
        email: email.toLowerCase(),
      });
    }

    // Create a new Google user
    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        firebaseUid,
        authProvider: "google",
      });
    } else {
      // Link Firebase UID to existing account
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
      }

      if (!user.authProvider) {
        user.authProvider = "google";
      }

      if (!user.name && name) {
        user.name = name;
      }

      await user.save();
    }

    // Create our application's JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Google Login Error:", err);

    res.status(401).json({
      message: "Google authentication failed",
    });
  }
};