const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/products', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    image_url: String,
});

const Product = mongoose.model('Product', productSchema);
app.post('/api/products', async (req, res) => {
    const { name, description, price, image_url, brand, category } = req.body;
    const newProduct = new Product({
        name,
        description,
        price,
        image_url,
        brand,
        category,
    });
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Failed to add product", error: error.message });
    }
});
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
