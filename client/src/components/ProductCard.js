// src/components/ProductCard.js

import React from 'react';

function ProductCard({ product, onDelete }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p>{product.description}</p>
      <button onClick={() => onDelete(product._id, product.name)}>Delete</button>
    </div>
  );
}

export default ProductCard;