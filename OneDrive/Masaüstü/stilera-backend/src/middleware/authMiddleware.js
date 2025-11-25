// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token var mı kontrol et
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Yetkisiz erişim. Token yok." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // .env'deki gizli anahtar ile token doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token'dan çıkan id ile kullanıcıyı bul ve req.user içine koy
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Geçersiz kullanıcı." });
    }

    // Devam et
    next();
  } catch (error) {
    console.error("JWT Hatası:", error);
    return res.status(401).json({ message: "Geçersiz veya süresi dolmuş token." });
  }
};

module.exports = authMiddleware;
