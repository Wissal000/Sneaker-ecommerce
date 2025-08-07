import { useEffect, useState } from "react";
import axios from "axios";
import background from "../assets/background.png";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4040/product");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black text-white py-16 px-4 sm:px-8 lg:px-16 overflow-hidden">
      {/* Glowing background */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/20 rounded-full" />

      {/* Top banner with overlay text */}
      <div className="relative w-full h-[480px] rounded-xl overflow-hidden shadow-lg mb-16">
        {/* Background Image */}
        <img
          src={background}
          alt="Sneaker Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        {/* Text content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="font-outfit text-2xl md:text-5xl font-extrabold text-green-500 drop-shadow-lg">
            Step Into Style
          </h1>
          <p className="font-playfair mt-4 text-lg md:text-2xl text-gray-200 max-w-xl">
            Explore our latest collection of premium sneakers — crafted for
            comfort & speed.
          </p>
          <button
            className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-full transition duration-200"
            onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <h2 className="font-outfit text-4xl font-bold mb-12">Explore Our Products</h2>

        {/* Product cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 md:px-10">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl shadow-md transition-transform duration-200 hover:-translate-y-2 hover:shadow-lg"
            >
              <ProductCardGrid product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCardGrid({ product }) {
  const { addToCart } = useCart();
  const [count, setCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  const discountedPrice =
    product.discount && product.discount > 0
      ? (product.price * (100 - product.discount)) / 100
      : null;

  const handleAdd = () => {
    if (count > 0 && selectedSize) {
      addToCart(product, count, selectedSize); // pass product, quantity, size separately
      toast.success(`Added to cart!`);
      setCount(0);
      setSelectedSize("");
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-white">
      {/* Product Image */}
      <div className="w-full h-48 rounded-xl overflow-hidden border-[#333] mb-3 relative group">
        <img
          src={product.imageUrl || "/fallback.png"}
          alt={product.name}
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.target.src = "/fallback.png")}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Info */}
      <div className="space-y-1 text-sm mb-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="font-playfair text-gray-400 italic">
          {product.brand} · {product.category}
        </p>
        {product.color && (
          <p className="font-playfair text-gray-300">
            <span className="text-gray-400">Color:</span> {product.color}
          </p>
        )}

        {product.sizes?.length > 0 && (
          <div className="mt-3">
            <label className="block text-sm text-gray-400 mb-2">
              Choose Size
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all
            ${
              selectedSize === size
                ? "bg-green-600 text-white border-green-600"
                : "bg-[#2a2a2a] text-gray-300 border-[#444] hover:border-green-500 hover:text-white"
            }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price & Actions */}
      <div className="mt-auto pt-4 border-t border-[#2a2a2a]">
        <div className="flex items-center justify-between">
          {/* Price Info */}
          <div className="flex flex-col text-green-400 font-semibold text-base">
            {discountedPrice ? (
              <>
                <span>{discountedPrice.toFixed(2)} dh</span>
                <span className="text-sm text-gray-500 line-through">
                  {product.price} dh
                </span>
                <span className="text-xs text-red-500 bg-red-600/20 px-2 py-0.5 rounded mt-1 w-fit">
                  -{product.discount}%
                </span>
              </>
            ) : (
              <span>{product.price} dh</span>
            )}
          </div>

          {/* Add to Cart Actions */}
          <div className="flex items-center gap-2">
            {count === 0 ? (
              <button
                onClick={() => setCount(1)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full text-sm"
              >
                Add
              </button>
            ) : (
              <>
                <button
                  onClick={() => setCount((prev) => Math.max(prev - 1, 0))}
                  className="w-7 h-7 bg-green-700 hover:bg-green-600 text-white rounded-full text-sm"
                >
                  −
                </button>
                <span className="w-5 text-center text-white">{count}</span>
                <button
                  onClick={() => setCount((prev) => prev + 1)}
                  className="w-7 h-7 bg-green-700 hover:bg-green-600 text-white rounded-full text-sm"
                >
                  +
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!selectedSize}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedSize
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  Confirm
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
