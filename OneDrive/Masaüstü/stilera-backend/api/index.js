const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("../src/config/db");
const productRoutes = require("../src/routes/productRoutes");
const authRoutes = require("../src/routes/authRoutes");
const cartRoutes = require("../src/routes/cartRoutes");

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("Vercel Backend API Çalışıyor!");
});

module.exports = (req, res) => {
  return app(req, res);
};
