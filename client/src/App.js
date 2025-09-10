// App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";

/* ---------- Navbar ---------- */
function Navbar({ onAddClick }) {
  return (
    <nav className="navbar">
      <h1 className="logo">🛒 Product Manager</h1>
      <div className="nav-links">
        <Link to="/" className="nav-btn">🏠 Home</Link>
        <Link
          to="/add"
          className="nav-btn"
          onClick={() => {
            if (onAddClick) onAddClick();
          }}
        >
          ➕ Add Item
        </Link>
        <Link to="/list" className="nav-btn">📋 Show Items</Link>
      </div>
    </nav>
  );
}

/* ---------- Home Page with Carousel ---------- */
function Home({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Replace with your own images in /public/images folder
  const images = [
    "/images/vegetables.jpg",
    "/images/lays.png",
    "/images/oil.jpg",
  ];

  return (
    <div className="home">
      <h2>Welcome to Product Manager</h2>

      <div className="carousel">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="carousel-image"
        />
        <div className="carousel-indicators">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`indicator ${idx === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
            ></span>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p>No items present. Click "Add Item" to create one.</p>
      ) : (
        <p>Currently you have {products.length} item(s) in your catalog.</p>
      )}
    </div>
  );
}

/* ---------- Add / Edit Page ---------- */
function AddProduct({ products, setProducts, formData, setFormData, editingId, setEditingId }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (editingId) {
      const product = products.find((p) => p.id === editingId);
      if (product) {
        setFormData({ name: product.name, price: String(product.price), category: product.category || "" });
      }
    } else {
      setFormData({ name: "", price: "", category: "" });
    }
  }, [editingId, products, setFormData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || formData.price === "" || formData.price === null) {
      alert("Please enter product name and price");
      return;
    }

    const priceNum = Number(formData.price);

    if (editingId) {
      setProducts(
        products.map((p) =>
          p.id === editingId ? { ...p, name: formData.name, price: priceNum, category: formData.category } : p
        )
      );
      setEditingId(null);
    } else {
      setProducts([...products, { id: Date.now(), name: formData.name, price: priceNum, category: formData.category }]);
    }

    setFormData({ name: "", price: "", category: "" });
    navigate("/list");
  };

  return (
    <div className="product-form">
      <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
        <button type="submit">{editingId ? "✅ Update Product" : "➕ Add Product"}</button>
      </form>
    </div>
  );
}

/* ---------- Product List Page ---------- */
function ProductList({ products, setProducts, setFormData, setEditingId }) {
  const [sortOrder, setSortOrder] = useState("none");
  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleEdit = (product) => {
    setFormData({ name: product.name, price: String(product.price), category: product.category || "" });
    setEditingId(product.id);
    navigate("/add"); // ✅ use navigate instead of window.location.href
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "lowToHigh") return a.price - b.price;
    if (sortOrder === "highToLow") return b.price - a.price;
    return 0;
  });

  return (
    <div className="product-list">
      <h2>Product List</h2>

      <div className="sort-buttons">
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="none">Sort By</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {sortedProducts.length === 0 ? (
        <p>No products added yet</p>
      ) : (
        <div className="product-grid">
          {sortedProducts.map((p) => (
            <div key={p.id} className="product-card">
              <h3>{p.name}</h3>
              <p><strong>₹{p.price}</strong></p>
              <p>{p.category}</p>
              <button className="edit-btn" onClick={() => handleEdit(p)}>✏ Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(p.id)}>❌ Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- App Root ---------- */
function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: "", category: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("products");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const normalized = parsed.map((p) => ({ ...p, price: Number(p.price) }));
        setProducts(normalized);
      }
    } catch (err) {
      console.error("Failed to load products from localStorage:", err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("products", JSON.stringify(products));
    } catch (err) {
      console.error("Failed to save products to localStorage:", err);
    }
  }, [products]);

  const handleNavAddClick = () => {
    setFormData({ name: "", price: "", category: "" });
    setEditingId(null);
  };

  return (
    <Router>
      <Navbar onAddClick={handleNavAddClick} />
      <Routes>
        <Route path="/" element={<Home products={products} />} />
        <Route
          path="/add"
          element={
            <AddProduct
              products={products}
              setProducts={setProducts}
              formData={formData}
              setFormData={setFormData}
              editingId={editingId}
              setEditingId={setEditingId}
            />
          }
        />
        <Route
          path="/list"
          element={
            <ProductList
              products={products}
              setProducts={setProducts}
              setFormData={setFormData}
              setEditingId={setEditingId}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
