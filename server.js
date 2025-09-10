// server.js

// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();
// Create the Express app
const app = express();
const port = 5000;

// Middleware to parse JSON bodies and enable CORS
app.use(cors());
app.use(express.json());

// --- Database Connection ---
// Replace the URI with your MongoDB connection string
const mongoURI = process.env.MONGO_URL;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schema & Model ---
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

// --- API Endpoints ---

// GET /api/products: Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/products: Add a new product
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: 'Invalid product data' });
    }
});

// DELETE /api/products/:id: Delete a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});