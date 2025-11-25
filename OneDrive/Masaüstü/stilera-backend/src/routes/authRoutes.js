const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // opsiyonel, aşağıda var

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile); // korumalı route (opsiyonel)

module.exports = router;
