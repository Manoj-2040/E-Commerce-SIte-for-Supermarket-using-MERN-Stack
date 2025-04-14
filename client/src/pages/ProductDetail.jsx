import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error(error));
  }, [id]);

  const handleIncrease = () => {
    // Increase quantity only if less than available stock
    if (quantity < product.countInStock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item._id === product._id);
    if (existingIndex > -1) {
      // Check if adding the new quantity exceeds stock
      const newQty = cart[existingIndex].qty + quantity;
      if (newQty > product.countInStock) {
        alert('Cannot add more than available stock');
        return;
      }
      cart[existingIndex].qty = newQty;
    } else {
      cart.push({ ...product, qty: quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart');
  };

  if (!product) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.imageContainer}>
          <img src={product.image} alt={product.name} style={styles.image} />
        </div>
        <div style={styles.details}>
          <h2 style={styles.title}>{product.name}</h2>
          <p style={styles.description}>{product.description}</p>
          <p style={styles.category}>
            Category: <span style={styles.categoryText}>{product.category}</span>
          </p>
          <p style={styles.price}>Price: Rs. {product.price}</p>
          <p style={styles.available}>
            Available Quantity: {product.countInStock}
          </p>
          <div style={styles.quantityContainer}>
            <button onClick={handleDecrease} style={styles.quantityButton}>–</button>
            <span style={styles.quantity}>{quantity}</span>
            <button onClick={handleIncrease} style={styles.quantityButton}>+</button>
          </div>
          {product.countInStock === 0 ? (
            <button style={{ ...styles.addButton, backgroundColor: '#ccc', cursor: 'not-allowed' }} disabled>
              Out of Stock
            </button>
          ) : (
            <button onClick={addToCart} style={styles.addButton}>Add to Cart</button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  loading: {
    padding: '2rem',
    color: '#fff',
    backgroundColor: '#121212',
    textAlign: 'center',
    minHeight: '100vh'
  },
  container: {
    padding: '2rem',
    backgroundColor: '#121212',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)',
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '900px',
    width: '100%',
    overflow: 'hidden'
  },
  imageContainer: {
    flex: '1 1 400px',
    minWidth: '300px'
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover'
  },
  details: {
    flex: '1 1 400px',
    padding: '2rem',
    color: '#e0e0e0'
  },
  title: {
    marginBottom: '1rem',
    color: '#28a745'
  },
  description: {
    marginBottom: '1rem',
    lineHeight: '1.6'
  },
  category: {
    marginBottom: '1rem',
    fontWeight: 'bold'
  },
  categoryText: {
    fontWeight: 'normal',
    color: '#ccc'
  },
  price: {
    marginBottom: '1.5rem',
    fontSize: '1.2rem'
  },
  available: {
    marginBottom: '1.5rem',
    fontSize: '1rem',
    color: '#ccc'
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  quantityButton: {
    backgroundColor: '#28a745',
    color: '#121212',
    border: 'none',
    padding: '0.5rem 1rem',
    fontSize: '1.2rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '1rem'
  },
  quantity: {
    fontSize: '1.2rem',
    marginRight: '1rem'
  },
  addButton: {
    backgroundColor: '#28a745',
    color: '#121212',
    border: 'none',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  }
};

export default ProductDetail;
