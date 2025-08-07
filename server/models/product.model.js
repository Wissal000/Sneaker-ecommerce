import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
     brand: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number, // optional discount %
      default: 0,
    },
    imageUrl: {
      type: String, // URL of the product image
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true, // e.g., 'Men', 'Women', 'Unisex'
    },
    sizes: {
      type: [Number], // available sizes (e.g., [38, 39, 40])
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    stock: {
      type: Map,
      of: Number, // stock per size: { "40": 10, "41": 2 }
      required: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
