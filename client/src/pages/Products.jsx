import React, { useEffect, useState } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch all products on component mount
  useEffect(() => {
    api.get('/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  // Filter products based on search query and selected category
  useEffect(() => {
    let filtered = products;

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, products, selectedCategory]);

  // Extract unique categories from products
  const categories = Array.from(new Set(products.map(product => product.category)));

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#ccc' }}>
        Our Products 🛍️
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#ccc' }}>
        Browse through our extensive collection and find your favorites!
      </p>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search for products 🔍..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <label htmlFor="category-filter" style={{ marginRight: '10px', fontSize: '16px', color: '#ccc' }}>
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Product Listing */}
      {filteredProducts.length > 0 ? (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'center'
        }}>
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#777' }}>
          No products found 😔. Try a different search!
        </p>
      )}
    </div>
  );
};

export default Products;
