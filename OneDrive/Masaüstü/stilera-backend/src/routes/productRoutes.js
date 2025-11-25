const express = require("express");
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// GET -> Tüm ürünleri getir veya filtrele
router.get("/", getProducts);

// POST -> Yeni ürün oluştur
router.post("/", createProduct);

// GET -> ID ile tek ürün getir
router.get("/:id", getProductById);

// PUT -> Ürün güncelle
router.put("/:id", updateProduct);

// DELETE -> Ürün sil
router.delete("/:id", deleteProduct);

module.exports = router;
