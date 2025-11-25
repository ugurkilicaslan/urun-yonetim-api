const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // Cinsiyet (Kadın, Erkek, Unisex vs.)
    gender: {
      type: String,
      enum: ["Kadın", "Erkek", "Kadın-Erkek", "Unisex"],
      required: true,
    },

    // Ana kategori ve alt kategori
    category: { type: String, required: true }, // Örn: "Üst Giyim", "Alt Giyim"
    subCategory: { type: String }, // Örn: "Tişört", "Pantolon"

    // Ürün detayları
    price: { type: Number, required: true },
    size: [{ type: String }], // ["S", "M", "L", "XL"]
    color: [{ type: String }], // ["Siyah", "Beyaz"]
    material: { type: String }, // "Pamuk", "Keten"
    length: { type: String }, // "Kısa", "Orta", "Uzun"
    stock: { type: Number, default: 0 },
    description: { type: String },

    // Ek özellikler
    features: [{ type: String }], // ["Yıkamaya dayanıklı", "Kolay ütülenir"]
    tags: [{ type: String }], // ["yeni", "trend", "indirim"]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
