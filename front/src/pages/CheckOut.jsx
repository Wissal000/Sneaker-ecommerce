import { useCart } from "../context/CartContext";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const totalPrice = cart.reduce((acc, { product, quantity }) => {
    const discountedPrice =
      product.discount && product.discount > 0
        ? (product.price * (100 - product.discount)) / 100
        : product.price;
    return acc + discountedPrice * quantity;
  }, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return toast.error("Cart is empty.");
    if (
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address
    )
      return toast.error("Please fill all fields.");

    setIsPlacingOrder(true);
    try {
      await axios.post("http://localhost:4040/order", {
        customer,
        items: cart.map(({ product, quantity, size }) => ({
          productId: product._id,
          quantity,
          size,
          priceAtPurchase: product.discount
            ? (product.price * (100 - product.discount)) / 100
            : product.price,
        })),
        total: totalPrice,
      });

      toast.success("Order placed!");
      clearCart();
      setCustomer({ name: "", email: "", phone: "", address: "" });
    } catch (err) {
      toast.error("Order failed");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 bg-black text-white"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, #111 0, #111 2px, #000 2px, #000 20px)",
      }}
    >
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 bg-[#0f0f0f] border-green-700 rounded-2xl shadow-xl p-8 font-outfit">
        {/* Cart Summary */}
        <div className="bg-[#141414] border border-green-800 rounded-xl p-6 shadow-inner max-h-[600px] overflow-y-auto">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Your Order</h2>

          {cart.length === 0 ? (
            <p className="text-green-500">No items in cart.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map(({ product, quantity, size }) => {
                const discounted =
                  product.discount && product.discount > 0
                    ? (product.price * (100 - product.discount)) / 100
                    : product.price;
                return (
                  <li
                    key={product._id + size}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-green-300">
                        {product.name}
                      </p>
                      <p className="text-sm text-green-500">
                        Qty: {quantity} | Size: {size}
                      </p>
                    </div>
                    <p className="text-green-400 font-medium">
                      {(discounted * quantity).toFixed(2)} dh
                    </p>
                  </li>
                );
              })}
            </ul>
          )}

          {cart.length > 0 && (
            <div className="border-t border-green-700 mt-6 pt-4 flex justify-between font-bold text-green-400 text-lg">
              <span>Total:</span>
              <span>{totalPrice.toFixed(2)} dh</span>
            </div>
          )}
        </div>

        {/* Customer Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-green-400">Shipping Info</h2>

          <FloatingInput
            label="Full Name"
            name="name"
            value={customer.name}
            onChange={handleInputChange}
            type="text"
          />
          <FloatingInput
            label="Email"
            name="email"
            value={customer.email}
            onChange={handleInputChange}
            type="email"
          />
          <FloatingInput
            label="Phone"
            name="phone"
            value={customer.phone}
            onChange={handleInputChange}
            type="tel"
          />
          <FloatingTextarea
            label="Address"
            name="address"
            value={customer.address}
            onChange={handleInputChange}
          />

          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300
             bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500
             text-white shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlacingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Floating Input Component
function FloatingInput({ label, name, value, onChange, type }) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-black border border-green-600 text-green-200 rounded-md px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder=" "
      />
      <label className="absolute left-4 top-2 text-sm text-green-500 pointer-events-none transition-all">
        {label}
      </label>
    </div>
  );
}

// Floating Textarea
function FloatingTextarea({ label, name, value, onChange }) {
  return (
    <div className="relative">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full bg-black border border-green-600 text-green-200 rounded-md px-4 pt-6 pb-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder=" "
      />
      <label className="absolute left-4 top-2 text-sm text-green-500 pointer-events-none transition-all">
        {label}
      </label>
    </div>
  );
}
