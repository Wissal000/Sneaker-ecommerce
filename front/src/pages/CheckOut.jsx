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
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-8 lg:px-16 font-outfit">
      <div className="max-w-3xl mx-auto bg-[#111] rounded-xl shadow-lg p-6 space-y-8">
        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">
          Checkout
        </h2>

        {/* Customer Info Form */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={customer.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-green-600"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={customer.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-green-600"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Phone</label>
            <input
              type="text"
              name="phone"
              value={customer.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-green-600"
              placeholder="+212..."
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Address</label>
            <textarea
              name="address"
              value={customer.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-green-600"
              placeholder="Street, City, Zip Code"
              rows={3}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div>
          <h3 className="text-xl font-medium mb-4 border-b border-gray-700 pb-1">
            Your Cart
          </h3>

          {cart.length === 0 ? (
            <p className="text-gray-400 text-center">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map(({ product, quantity, size }) => {
                const discountedPrice =
                  product.discount && product.discount > 0
                    ? (product.price * (100 - product.discount)) / 100
                    : product.price;

                return (
                  <li
                    key={product._id + size}
                    className="flex justify-between items-center border-b border-gray-700 pb-3"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-400">Qty: {quantity}</p>
                      <p className="text-sm text-gray-500 italic">
                        Size: {size}
                      </p>
                    </div>
                    <div className="text-green-400 font-medium">
                      {(discountedPrice * quantity).toFixed(2)} dh
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Total + Button */}
        {cart.length > 0 && (
          <>
            <div className="border-t border-gray-700 pt-4 text-right">
              <p className="text-lg">
                Total:{" "}
                <span className="text-green-400 font-semibold">
                  {totalPrice.toFixed(2)} dh
                </span>
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-6 py-2 rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
