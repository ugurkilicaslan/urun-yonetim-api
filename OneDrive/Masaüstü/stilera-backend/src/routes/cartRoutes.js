const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // Ürün modelini yüklüyoruz

// Kullanıcının sepeti (gerçek projede DB kullanılır)
let cart = [];

/**
 * 📌 SEPETE ÜRÜN EKLE
 * Route: POST /api/cart/add
 * Body: { productId, quantity }
 */
router.post("/add", async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                error: "productId ve quantity gerekiyor"
            });
        }

        // Ürünü DB’den çek
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Ürün bulunamadı" });
        }

        // Stok kontrolü
        if (product.stock < quantity) {
            return res.status(400).json({
                error: `Yetersiz stok! Maksimum ${product.stock} adet ekleyebilirsiniz.`
            });
        }

        // Sepette ürün zaten var mı?
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;

            // stok aşımı kontrolü
            if (existingItem.quantity > product.stock) {
                existingItem.quantity = product.stock;
            }
        } else {
            cart.push({
                productId,
                quantity
            });
        }

        return res.json({
            message: "Ürün sepete eklendi",
            cart
        });

    } catch (error) {
        console.error("Sepete ekleme hatası:", error);
        return res.status(500).json({ error: "Sunucu hatası!" });
    }
});

/**
 * 📌 SEPETİ GETİR
 * Route: GET /api/cart
 */
router.get("/", async (req, res) => {
    try {
        // Her sepet ürününü DB’den çekip detaylı döndürüyoruz
        const detailedCart = [];

        for (const item of cart) {
            const product = await Product.findById(item.productId);

            if (product) {
                detailedCart.push({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    color: product.color,
                    size: product.size,
                    quantity: item.quantity,
                    image: product.images ? product.images[0] : null
                });
            }
        }

        return res.json(detailedCart);

    } catch (error) {
        console.error("Sepeti çekme hatası:", error);
        return res.status(500).json({ error: "Sunucu hatası!" });
    }
});

/**
 * 📌 SEPETTEN ÜRÜN SİL
 * Route: DELETE /api/cart/remove/:id
 */
router.delete("/remove/:id", (req, res) => {
    const { id } = req.params;

    cart = cart.filter(item => item.productId !== id);

    return res.json({
        message: "Ürün sepetten silindi",
        cart
    });
});

/**
 * 📌 SEPETİ TEMİZLE
 * Route: DELETE /api/cart/clear
 */
router.delete("/clear", (req, res) => {
    cart = [];
    return res.json({ message: "Sepet temizlendi" });
});

module.exports = router;
