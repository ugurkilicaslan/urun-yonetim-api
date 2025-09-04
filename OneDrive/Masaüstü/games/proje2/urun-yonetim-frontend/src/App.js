import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });

  // Ürünleri backend'den çek
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Ürün ekle
  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    try {
      const res = await axios.post("http://localhost:5000/api/products", newProduct);
      setProducts([...products, res.data]);
      setNewProduct({ name: "", price: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Ürün sil
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Ürün Yönetim Paneli</h1>

      {/* Ürün ekleme formu */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Yeni Ürün Ekle</h2>
        <input
          type="text"
          placeholder="Ürün adı"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="number"
          placeholder="Fiyat"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={addProduct}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Ekle
        </button>
      </div>

      {/* Ürün listesi */}
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Ürün Listesi</h2>
        {products.length > 0 ? (
          <ul className="space-y-3">
            {products.map((product) => (
              <li
                key={product._id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
              >
                <span className="text-gray-700 font-medium">
                  {product.name} - {product.price} ₺
                </span>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Henüz ürün yok.</p>
        )}
      </div>
    </div>
  );
}

export default App;
