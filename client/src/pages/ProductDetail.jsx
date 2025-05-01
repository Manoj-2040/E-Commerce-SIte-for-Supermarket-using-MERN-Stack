import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/products/reviews/${id}`);
      console.log(response.data);
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.countInStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex((item) => item._id === product._id);
    if (existingIndex > -1) {
      const newQty = cart[existingIndex].qty + quantity;
      if (newQty > product.countInStock) {
        alert("Cannot add more than available stock");
        return;
      }
      cart[existingIndex].qty = newQty;
    } else {
      cart.push({ ...product, qty: quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return alert("Review cannot be empty");
    if (rating === 0) return alert("Please select a star rating");

    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName") || "Anonymous";
    const state = rating <= 2 ? "negative" : "positive";

    if (!userId) {
      alert("Please log in to submit a review.");
      return;
    }

    setReviewSubmitting(true);
    try {
      const res = await api.post(`/products/reviews/${id}`, {
        productId: id,
        userId,
        userName,
        review: newReview,
        stars: rating,
        state,
      });
      console.log(res);
      setNewReview("");
      setRating(0);
      fetchReviews();
      alert("Review submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
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
            Category:{" "}
            <span style={styles.categoryText}>{product.category}</span>
          </p>
          <p style={styles.price}>Price: Rs. {product.price}</p>
          <p style={styles.available}>
            Available Quantity: {product.countInStock}
          </p>

          <div style={styles.quantityContainer}>
            <button onClick={handleDecrease} style={styles.quantityButton}>
              –
            </button>
            <span style={styles.quantity}>{quantity}</span>
            <button onClick={handleIncrease} style={styles.quantityButton}>
              +
            </button>
          </div>

          {product.countInStock === 0 ? (
            <button
              style={{
                ...styles.addButton,
                backgroundColor: "#ccc",
                cursor: "not-allowed",
              }}
              disabled>
              Out of Stock
            </button>
          ) : (
            <button onClick={addToCart} style={styles.addButton}>
              Add to Cart
            </button>
          )}

          {/* Reviews Section */}
          <div style={styles.reviewsSection}>
            <h3 style={styles.reviewTitle}>Reviews</h3>
            {reviews.length === 0 ? (
              <p style={styles.noReviews}>No reviews yet.</p>
            ) : (
              reviews.map((review, idx) => (
                <div key={idx} style={styles.reviewItem}>
                  <p style={styles.reviewComment}> {review.stars} ★</p>
                  <p style={styles.reviewComment}>“{review.review}”</p>
                  <p style={styles.reviewMeta}>
                    - {review.userName || "Anonymous"}
                  </p>
                </div>
              ))
            )}

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} style={styles.reviewForm}>
              {/* 5 Star Rating */}
              <div style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      ...styles.star,
                      color:
                        (hoverRating || rating) >= star ? "#ffc107" : "#555",
                      transform:
                        (hoverRating || rating) >= star
                          ? "scale(1.2)"
                          : "scale(1)",
                    }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}>
                    ★
                  </span>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder='Write your review...'
                style={styles.textarea}
                disabled={reviewSubmitting}
              />

              {/* Submit Button */}
              <button
                type='submit'
                style={styles.submitButton}
                disabled={reviewSubmitting}>
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  loading: {
    padding: "2rem",
    color: "#fff",
    backgroundColor: "#121212",
    textAlign: "center",
    minHeight: "100vh",
  },
  container: {
    padding: "2rem",
    backgroundColor: "#121212",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)",
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "1000px",
    width: "100%",
    overflow: "hidden",
  },
  imageContainer: {
    flex: "1 1 400px",
    minWidth: "300px",
  },
  starContainer: {
    display: "flex",
    marginBottom: "1rem",
  },
  star: {
    fontSize: "2rem",
    cursor: "pointer",
    transition: "transform 0.2s, color 0.2s",
    marginRight: "0.5rem",
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
  },
  details: {
    flex: "1 1 500px",
    padding: "2rem",
    color: "#e0e0e0",
  },
  title: {
    marginBottom: "1rem",
    color: "#28a745",
  },
  description: {
    marginBottom: "1rem",
    lineHeight: "1.6",
  },
  category: {
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  categoryText: {
    fontWeight: "normal",
    color: "#ccc",
  },
  price: {
    marginBottom: "1.5rem",
    fontSize: "1.2rem",
  },
  available: {
    marginBottom: "1.5rem",
    fontSize: "1rem",
    color: "#ccc",
  },
  quantityContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  quantityButton: {
    backgroundColor: "#28a745",
    color: "#121212",
    border: "none",
    padding: "0.5rem 1rem",
    fontSize: "1.2rem",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "1rem",
  },
  quantity: {
    fontSize: "1.2rem",
    marginRight: "1rem",
  },
  addButton: {
    backgroundColor: "#28a745",
    color: "#121212",
    border: "none",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  reviewsSection: {
    marginTop: "2rem",
  },
  reviewTitle: {
    marginBottom: "1rem",
    fontSize: "1.5rem",
    color: "#28a745",
  },
  noReviews: {
    color: "#999",
    marginBottom: "1rem",
  },
  reviewItem: {
    marginBottom: "1rem",
    borderBottom: "1px solid #333",
    paddingBottom: "1rem",
  },
  reviewComment: {
    fontStyle: "italic",
  },
  reviewMeta: {
    fontSize: "0.9rem",
    color: "#777",
  },
  reviewForm: {
    marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
  },
  textarea: {
    minHeight: "80px",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #555",
    backgroundColor: "#2a2a2a",
    color: "#fff",
    resize: "vertical",
    marginBottom: "1rem",
  },
  submitButton: {
    backgroundColor: "#28a745",
    color: "#121212",
    border: "none",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    alignSelf: "flex-end",
    transition: "background-color 0.3s ease",
  },
};

export default ProductDetail;
