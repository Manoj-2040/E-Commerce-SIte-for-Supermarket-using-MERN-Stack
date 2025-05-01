const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  const { orderItems, totalPrice, userId, paymentId } = req.body;
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    // Decrease stock of each product
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      // console.log("Product Found:", product);
      if (!product) continue;

      product.countInStock = Math.max(0, product.countInStock - item.qty); // Ensure it doesn't go negative
      await product.save();
    }

    const order = new Order({
      orderItems,
      totalPrice,
      userId,
      isPaid: true,
      paymentId,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders (Admin only)
exports.getOrders = async (req, res) => {
  try {
    // Populate orderItems.product to get product details (assuming your orderItems array stores product IDs)
    const orders = await Order.find({}).populate("orderItems.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
