import express from "express";
import OrderModel from "../models/order.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { customer, items, total } = req.body;

    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.phone ||
      !customer?.address
    ) {
      return res.status(400).json({ error: "Missing customer information" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Optional: Validate total is a number
    if (typeof total !== "number") {
      return res.status(400).json({ error: "Invalid total price" });
    }

    // Save order to database
    const newOrder = new OrderModel({
      customerInfo: {
        fullName: customer.name,
        email: customer.email,
        phoneNumber: customer.phone,
        address: customer.address,
      },
      products: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        priceAtPurchase: item.priceAtPurchase, // <-- Add this
      })),
      totalAmount: total,
    });

    await newOrder.save();

    return res.status(201).json({ message: "Order placed successfully!" });
  } catch (err) {
    console.error("Order error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate("products.productId", "name price") // Only product info is referenced
      .exec();

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

export default router;
