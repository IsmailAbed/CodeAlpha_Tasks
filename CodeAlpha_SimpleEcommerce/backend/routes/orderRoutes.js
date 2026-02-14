const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();

// CREATE order
router.post("/", async (req, res) => {
  try {
    const { products } = req.body;

    let totalAmount = 0;

    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      totalAmount += product.price * item.quantity;

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      products,
      totalAmount,
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
