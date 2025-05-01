import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css"; // Import the CSS file
import { useState,useEffect } from "react";
import api from "../api";

const ProductCard = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [averageStars, setAverageStars] = useState(0);
  const [reviewState, setReviewState] = useState("");
  console.log(product);
  useEffect(() => {
    if (product._id) {
      api
        .get(`products/reviews/${product._id}`)
        .then((response) => {
          const fetchedReviews = response.data;
          setReviews(fetchedReviews);

          if (fetchedReviews.length > 0) {
            const totalStars = fetchedReviews.reduce(
              (sum, review) => sum + review.stars,
              0
            );
            const avg = totalStars / fetchedReviews.length;
            setAverageStars(avg);

            // Set positive or negative
            if (avg <= 2) {
              setReviewState("negative");
            } else {
              setReviewState("positive");
            }
          }
        })
        .catch((error) => console.error(error));
    }
  }, [product._id]);

  const renderStars = () => {
    const fullStars = Math.floor(averageStars);
    const starsArray = [];

    for (let i = 0; i < fullStars; i++) {
      starsArray.push(<span key={i}>⭐</span>);
    }

    if (starsArray.length === 0) {
      return <span>No Reviews Yet</span>;
    }

    return starsArray;
  };
  return (
    <div className='product-card'>
      <div className='product-card__image-container'>
        <img
          className='product-card__image'
          src={product.image}
          alt={product.name}
        />
      </div>
      <div className='product-card__content'>
        <h3 className='product-card__title'>{product.name}</h3>
        <p className='product-card__price'>₹ {product.price}.00</p>{" "}
        {/* Stars and Reviews */}
        <div style={{ marginTop: "8px" }}>
          <div>{renderStars()}</div>
          {reviewState && (
            <div
              style={{
                marginTop: "4px",
                display: "inline-block",
                padding: "2px 6px",
                borderRadius: "12px",
                backgroundColor:
                  reviewState === "positive" ? "#28a745" : "#dc3545",
                color: "white",
                fontSize: "12px",
              }}>
              {reviewState === "positive"
                ? "Positive Reviews"
                : "Negative Reviews"}
            </div>
          )}
        </div>
        {/* Improved Price Display */}
        <Link to={`/product/${product._id}`} className='product-card__button'>
          🛒 Buy Now
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
