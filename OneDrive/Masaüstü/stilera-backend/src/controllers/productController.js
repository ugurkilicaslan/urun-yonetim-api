const Product = require("../models/Product");

// Tüm ürünleri getir veya filtrele
const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    let query = {};

    // Kategori filtreleme
    if (category) query.category = category;

    // Arama (isim içinde geçen kelimeye göre)
    if (search) query.name = { $regex: search, $options: "i" };

    // Fiyat filtreleme
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "❌ Ürünler alınırken hata oluştu", error: err.message });
  }
};

// Yeni ürün oluştur
const createProduct = async (req, res) => {
  try {
    const { name, price, category, stock, size, color, description, gender } = req.body;

    const newProduct = await Product.create({
      name,
      price,
      category,
      stock,
      size,
      color,
      description,
      gender,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "❌ Ürün eklenirken hata oluştu", error: err.message });
  }
};

// ID ile tek ürün getir
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "❌ Ürün bulunamadı" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "❌ Ürün aranırken hata oluştu", error: err.message });
  }
};

// Ürün güncelle
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "❌ Ürün bulunamadı" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "❌ Güncelleme sırasında hata oluştu", error: err.message });
  }
};

// Ürün sil
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "❌ Ürün bulunamadı" });
    res.json({ message: "✅ Ürün silindi" });
  } catch (err) {
    res.status(500).json({ message: "❌ Silme sırasında hata oluştu", error: err.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
