import express from "express";
import upload from "../utils/cloudinaryStorage.js";
import Product from "../models/product.model.js";

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, brand, price, discount, description, category, color } =
      req.body;

    let sizes = [];
    let stock = [];

    // Safe parse sizes and stock
    try {
      sizes = JSON.parse(req.body.sizes || "[]");
      stock = JSON.parse(req.body.stock || "[]");
    } catch (parseError) {
      return res.status(400).json({ message: "Invalid sizes or stock format" });
    }

    // Ensure Multer uploaded file
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imageUrl = req.file.path;

    const newProduct = new Product({
      name,
      brand,
      price,
      discount,
      imageUrl,
      description,
      category,
      color,
      sizes,
      stock,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product saved successfully!" });
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});


// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from MongoDB
    res.status(200).json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// PUT (Update) product by ID
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, price, discount, description, category, color } =
      req.body;

    // Safely parse sizes and stock only if they are strings
    const sizes =
      typeof req.body.sizes === "string"
        ? JSON.parse(req.body.sizes)
        : req.body.sizes || [];

    const stock =
      typeof req.body.stock === "string"
        ? JSON.parse(req.body.stock)
        : req.body.stock || {};

    const updateFields = {
      name,
      brand,
      price,
      discount,
      description,
      category,
      color,
      sizes,
      stock,
    };

    // If an image was uploaded, update the imageUrl
    if (req.file) {
      updateFields.imageUrl = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res
      .status(200)
      .json({ message: "Product updated successfully!", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product", error });
  }
});

// DELETE /:id — Delete product by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res
      .status(200)
      .json({ message: "Product deleted successfully!", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product", error });
  }
});

export default router;
