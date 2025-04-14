import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css'; // Import the CSS file

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-card__image-container">
        <img className="product-card__image" src={product.image} alt={product.name} />
      </div>
      <div className="product-card__content">
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__price">₹ {product.price}.00</p> {/* Improved Price Display */}
        <Link to={`/product/${product._id}`} className="product-card__button">
          🛒 Buy Now
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;