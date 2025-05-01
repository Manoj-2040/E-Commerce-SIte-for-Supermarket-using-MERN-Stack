const Product = require("../models/Product");
const Review = require("../models/Review");
const mongoose = require("mongoose"); // <-- Add this import

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product (Admin only)
exports.createProduct = async (req, res) => {
  const { name, image, description, category, price, countInStock } = req.body;
  try {
    const product = new Product({
      name,
      image,
      description,
      category,
      price,
      countInStock,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const { name, image, description, category, price, countInStock } =
      req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name;
      product.image = image;
      product.description = description;
      product.category = category;
      product.price = price;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product (Admin only)
exports.deleteProduct = async (req, res) => {
  // console.log(`Deleting product with id: ${req.params.id}`);
  // Validate that the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.error("Invalid product id:", req.params.id);
    return res.status(400).json({ message: "Invalid product id" });
  }

  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    // console.log("Deleted product:", product);
    if (product) {
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error.name, error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    // console.log(req.body);
    const { productId, userId, userName, review, stars, state } = req.body;

    const newReview = new Review({
      productId,
      userId,
      userName,
      review,
      stars,
      state,
    });

    await newReview.save();

    res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const productId = req.params.id;

    const reviews = await Review.find({
      productId: new mongoose.Types.ObjectId(productId),
    });
    // console.log(reviews);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
