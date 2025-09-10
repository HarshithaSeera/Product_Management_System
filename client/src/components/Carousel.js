// src/components/Carousel.js
import React from 'react';
import './Carousel.css';

function Carousel({ products }) {
  return (
    <div className="carousel-container">
      <h2>🌟 Featured Products</h2>
      <div className="carousel">
        {products.slice(0, 5).map((product) => (
          <div key={product._id} className="carousel-card">
            <h3>{product.name}</h3>
            <p><strong>${product.price}</strong></p>
            <small>{product.category}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
