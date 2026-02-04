const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// In-memory storage for products
const products = [
    { id: 1, name: "Laptop", stock: 10 },
    { id: 2, name: "Mouse", stock: 50 },
    { id: 3, name: "Keyboard", stock: 20 }
];

//To show that Backend is running
app.get('/', (req, res) => {
    res.send('Inventory Backend is running');
});

//Get /products - Returns all products with current stock
app.get('/products', (req, res) => {
    res.json(products);
});

//POST /order - Place an order
app.post('/order', (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ error: "Missing productId or quantity" });
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    if (quantity > product.stock) {
        return res.status(400).json({ error: "Insufficient stock" });
    }

    // Reduce stock
    product.stock -= quantity;

    res.json({ message: "Order placed successfully", product });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
