const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  googleLogin,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/auth");

router.post("/register", signup);

router.post("/login", login);

router.post("/google", googleLogin);

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You have access to the protected route",
    user: req.user,
  });
});

module.exports = router;