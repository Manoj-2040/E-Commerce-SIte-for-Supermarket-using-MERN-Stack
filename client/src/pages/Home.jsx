import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel";
import { useUser } from "@clerk/clerk-react";

const Home = () => {
  // State variables
  const { user, isSignedIn } = useUser();
  const [query, setQuery] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [storeProducts, setStoreProducts] = useState([]);
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState("recipe"); // New state for toggling search mode
  const API_KEY = "3690be28a8bb489bb0fc7981b8857b1c"; // Replace with your actual Spoonacular API key

  // Fetch store products from the backend
  const fetchStoreProducts = async () => {
    try {
      const response = await axios.get("https://recommender-algorithm-model.onrender.com/api/products");
      setStoreProducts(response.data);
    } catch (err) {
      console.error("Error fetching store products:", err);
    }
  };

  useEffect(() => {
    fetchStoreProducts();
  }, []);

  // Function to fetch ingredients for searched food
  const fetchIngredients = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const searchResponse = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
          query
        )}&number=1&apiKey=${API_KEY}`
      );
      if (searchResponse.data.results.length > 0) {
        const recipeId = searchResponse.data.results[0].id;
        const recipeDetailsResponse = await axios.get(
          `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${API_KEY}`
        );
        const fetchedIngredients =
          recipeDetailsResponse.data.extendedIngredients.map((item) => ({
            name: item.name.toLowerCase(),
            amount: item.amount,
            unit: item.unit,
            image: item.image,
            id: item.id,
          }));
        setIngredients(fetchedIngredients);

        // Match ingredients with store products
        const matched = storeProducts.filter((product) => {
          const prodName = product.name.toLowerCase();
          return fetchedIngredients.some((ingredient) => {
            const ingName = ingredient.name.toLowerCase();
            return (
              prodName === ingName ||
              prodName.includes(ingName) ||
              ingName.includes(prodName)
            );
          });
        });
        setMatchingProducts(matched);
      } else {
        setIngredients([]);
        setMatchingProducts([]);
        console.error("No recipes found for the given query.");
      }
    } catch (err) {
      console.error("Error fetching recipe details:", err);
    }
    setLoading(false);
  };

  // Function to fetch products directly
  const fetchProducts = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const matched = storeProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setMatchingProducts(matched);
      setIngredients([]); // Clear ingredients when searching for products
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    setLoading(false);
  };

  // Handle search based on the selected mode
  const handleSearch = () => {
    if (searchMode === "recipe") {
      fetchIngredients();
    } else if (searchMode === "product") {
      fetchProducts();
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#121212",
        color: "#e0e0e0",
        minHeight: "100vh",
      }}>
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={3000}
        style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ position: "relative", height: "300px" }}>
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
            src='/images/image9.jpg'
            alt='Food 2'
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#000000",
              padding: "10px 20px",
              borderRadius: "5px",
              color: "#fff",
              fontSize: "24px",
              fontWeight: "bold",
            }}>
            Welcome to NMart
          </div>
        </div>
        <div style={{ position: "relative", height: "300px" }}>
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
            src='/images/image6.jpeg'
            alt='Food 1'
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#000000",
              padding: "10px 20px",
              borderRadius: "5px",
              color: "#fff",
              fontSize: "24px",
              fontWeight: "bold",
            }}>
            Order and PickUp 🛒
          </div>
        </div>
        <div style={{ position: "relative", height: "300px" }}>
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
            src='/images/image10.jpg'
            alt='Food 3'
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#000000",
              padding: "10px 20px",
              borderRadius: "5px",
              color: "#fff",
              fontSize: "24px",
              fontWeight: "bold",
            }}>
            Farm Fresh Products 🌱
          </div>
        </div>
      </Carousel>
      <br />
      <br />
      
      {/* Search Mode Toggle */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setSearchMode("recipe")}
          style={{
            padding: "10px 20px",
            backgroundColor: searchMode === "recipe" ? "#28a745" : "#333",
            color: "#fff",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            fontSize: "16px",
            marginRight: "10px",
            transition: "background-color 0.3s ease",
          }}>
          Search Recipe
        </button>
        <button
          onClick={() => setSearchMode("product")}
          style={{
            padding: "10px 20px",
            backgroundColor: searchMode === "product" ? "#28a745" : "#333",
            color: "#fff",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s ease",
          }}>
          Search Product
        </button>
      </div>

      {/* Search Section */}
      <div
        style={{ maxWidth: "800px", margin: "30px auto", textAlign: "center" }}>
        {isSignedIn && user && (
          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#ccc",
            }}>
            Hi, {user.fullName || user.firstName || "User"}!
          </h2>
        )}

        <p
          style={{
            marginTop: "10px",
            fontSize: "14px",
            color: "#bbb",
          }}>
          Example: Search for a food item 🍕 or a product 🛒 and get
          recommendations!
        </p>
        <input
          type='text'
          placeholder={`Search for a ${searchMode}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "10px 15px",
            width: "80%",
            maxWidth: "500px",
            marginBottom: "10px",
            border: "1px solid #555",
            borderRadius: "30px",
            fontSize: "16px",
            backgroundColor: "#333",
            color: "#fff",
          }}
        />
        <br />

        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "5px",
            transition: "background-color 0.3s ease",
          }}>
          Search
        </button>
      </div>

      {/* Ingredients and Products Section */}
      <div style={{ marginTop: "40px" }}>
        {loading ? (
          <p
            style={{ textAlign: "center", fontSize: "18px", color: "#28a745" }}>
            Loading...
          </p>
        ) : (
          <>
            {searchMode === "recipe" && ingredients.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <h3
                  style={{
                    marginBottom: "15px",
                    color: "#e0e0e0",
                    textAlign: "center",
                  }}>
                  Ingredients Required:
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "20px",
                  }}>
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      style={{
                        width: "200px",
                        border: "1px solid #333",
                        borderRadius: "8px",
                        padding: "15px",
                        backgroundColor: "#1e1e1e",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
                        textAlign: "center",
                      }}>
                      <img
                        src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                        alt={ingredient.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          marginBottom: "0.5rem",
                        }}
                      />
                      <h4
                        style={{
                          margin: "10px 0",
                          fontSize: "16px",
                          color: "#28a745",
                        }}>
                        {ingredient.name}
                      </h4>
                      <p style={{ fontSize: "14px", color: "#bbb" }}>
                        Amount: {ingredient.amount} {ingredient.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {matchingProducts.length > 0 ? (
              <div>
                <h3
                  style={{
                    marginBottom: "15px",
                    color: "#e0e0e0",
                    textAlign: "center",
                  }}>
                  Matching Store Products:
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    justifyContent: "center",
                  }}>
                  {matchingProducts.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        border: "1px solid #333",
                        padding: "15px",
                        borderRadius: "8px",
                        backgroundColor: "#1e1e1e",
                        width: "250px",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
                        textAlign: "center",
                      }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "5px",
                          marginBottom: "10px",
                        }}
                      />
                      <h4
                        style={{
                          marginBottom: "10px",
                          color: "#28a745",
                          fontSize: "18px",
                        }}>
                        {product.name}
                      </h4>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#ccc",
                          marginBottom: "10px",
                        }}>
                        {product.description}
                      </p>
                      <p
                        style={{
                          fontSize: "16px",
                          color: "#e0e0e0",
                          fontWeight: "bold",
                          marginBottom: "15px",
                        }}>
                        Price: ₹{product.price}
                      </p>
                      <Link
                        to={`/product/${product._id}`}
                        style={{
                          padding: "10px 15px",
                          backgroundColor: "#28a745",
                          color: "#fff",
                          textDecoration: "none",
                          borderRadius: "30px",
                          cursor: "pointer",
                          fontSize: "14px",
                          display: "inline-block",
                          textAlign: "center",
                          transition: "background-color 0.3s ease",
                        }}>
                        Product Details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              query && (
                <p style={{ color: "#f00", textAlign: "center" }}>
                  No matching results found.
                </p>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
