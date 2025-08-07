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
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address
    ) {
      toast.error("Please fill all customer information fields.");
      return;
    }

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
      console.error(err.response?.data || err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-outfit"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #222 1px, transparent 1px), 
                          radial-gradient(circle at 20px 20px, #222 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    >
      <div className="max-w-4xl w-full bg-gray-900 rounded-2xl shadow-lg p-10 space-y-10 border border-green-700">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-green-400 text-center">
          Checkout
        </h2>

        {/* Grid container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Customer Info Form */}
          <form className="space-y-6">
            <InputField
              label="Full Name"
              name="name"
              value={customer.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              type="text"
            />
            <InputField
              label="Email Address"
              name="email"
              value={customer.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              type="email"
            />
            <InputField
              label="Phone Number"
              name="phone"
              value={customer.phone}
              onChange={handleInputChange}
              placeholder="+212 600 000 000"
              type="tel"
            />
            <div>
              <label className="block mb-1 text-green-400 font-semibold">
                Address
              </label>
              <textarea
                name="address"
                value={customer.address}
                onChange={handleInputChange}
                rows={4}
                placeholder="Street, City, Zip Code"
                className="w-full rounded-md border border-green-600 bg-black px-4 py-3 text-green-300 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
          </form>

          {/* Cart Summary */}
          <div className="bg-black rounded-lg p-6 shadow-inner border border-green-700 overflow-y-auto max-h-[400px]">
            <h3 className="text-xl font-semibold mb-6 border-b border-green-700 pb-2 text-green-400">
              Your Cart
            </h3>

            {cart.length === 0 ? (
              <p className="text-green-600 text-center py-20">
                Your cart is empty.
              </p>
            ) : (
              <ul className="divide-y divide-green-700 max-h-[350px] overflow-y-auto">
                {cart.map(({ product, quantity, size }) => {
                  const discountedPrice =
                    product.discount && product.discount > 0
                      ? (product.price * (100 - product.discount)) / 100
                      : product.price;

                  return (
                    <li
                      key={product._id + size}
                      className="flex justify-between items-center py-3"
                    >
                      <div>
                        <p className="font-medium text-green-300">{product.name}</p>
                        <p className="text-sm text-green-500">
                          Qty: {quantity} | Size: {size}
                        </p>
                      </div>
                      <div className="text-green-400 font-semibold">
                        {(discountedPrice * quantity).toFixed(2)} dh
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Total */}
            {cart.length > 0 && (
              <div className="mt-6 border-t border-green-700 pt-4 flex justify-between text-lg font-semibold text-green-400">
                <span>Total:</span>
                <span>{totalPrice.toFixed(2)} dh</span>
              </div>
            )}
          </div>
        </div>

        {/* Place order button */}
        <div className="text-center">
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-10 rounded-full shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlacingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block mb-1 text-green-400 font-semibold">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-md border border-green-600 bg-black px-4 py-3 text-green-300 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
  );
}
