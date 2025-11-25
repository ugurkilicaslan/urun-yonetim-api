const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const productRoutes = require("./src/routes/productRoutes");
const authRoutes = require("./src/routes/authRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const connectDB = require("./src/config/db");

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("API Çalışıyor");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
