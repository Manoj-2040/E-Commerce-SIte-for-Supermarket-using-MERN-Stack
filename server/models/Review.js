const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    state: {
      type: String,
      enum: ["positive", "negative"],
      required: true,
    },
  },
  { timestamps: true }
);

// Before saving, automatically determine state based on stars
reviewSchema.pre("save", function (next) {
  if (this.stars <= 2) {
    this.state = "negative";
  } else {
    this.state = "positive";
  }
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
