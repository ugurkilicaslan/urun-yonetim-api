import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:5000/api/products";

  // Ürünleri çek
  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Ürün ekle veya güncelle
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, {
          name,
          price,
          description,
        });
      } else {
        await axios.post(API_URL, { name, price, description });
      }
      setName("");
      setPrice("");
      setDescription("");
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setEditingId(product._id);
  };

  // Ürün sil
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ürün Yönetim Paneli</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Ürün adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Fiyat"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Açıklama"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">
          {editingId ? "Güncelle" : "Ekle"}
        </button>
      </form>

      <ul>
        {products.map((product) => (
          <li key={product._id} style={{ marginBottom: "10px" }}>
            <strong>{product.name}</strong> - {product.price}₺ <br />
            {product.description}
            <br />
            <button onClick={() => handleEdit(product)}>Düzenle</button>
            <button onClick={() => handleDelete(product._id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
