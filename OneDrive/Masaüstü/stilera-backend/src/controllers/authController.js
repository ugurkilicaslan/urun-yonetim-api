const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Kullanıcı kayıt
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      phone,
      birthDate,
      gender,
      profilePhoto,
    } = req.body;

    // Email veya kullanıcı adı daha önce alınmış mı?
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "Bu email zaten kayıtlı." });

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı zaten alınmış." });

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      phone,
      birthDate,
      gender,
      profilePhoto,
    });

    // JWT token oluştur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Kayıt başarılı!",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        birthDate: user.birthDate,
        gender: user.gender,
        profilePhoto: user.profilePhoto,
      },
      token,
    });
  } catch (error) {
    console.error("Register Hatası:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

// Kullanıcı giriş
const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Kullanıcıyı email veya username ile bul
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user)
      return res.status(400).json({ message: "Kullanıcı bulunamadı." });

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Şifre yanlış." });

    // JWT token oluştur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Giriş başarılı.",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        birthDate: user.birthDate,
        gender: user.gender,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error("Login Hatası:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

// Profil bilgilerini getir (korumalı route)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });

    res.json(user);
  } catch (error) {
    console.error("Profil Hatası:", error);
    res.status(500).json({ message: "Profil alınamadı.", error });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
