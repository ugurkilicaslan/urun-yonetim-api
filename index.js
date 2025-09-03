const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const productRoutes = require('./routes/productRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Ürün Yönetim API çalışıyor!');
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/productdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch((err) => console.error('MongoDB bağlantı hatası:', err));

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
