import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, totalCount, increaseQty, decreaseQty, removeFromCart } =
    useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((sum, item) => {
    const price =
      item.product.discount && item.product.discount > 0
        ? (item.product.price * (100 - item.product.discount)) / 100
        : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-4xl font-bold mb-6 text-center">Cart</h2>

          {cart.length === 0 ? (
            <div className="text-gray-400 text-lg">
              Your cart is empty.
              <button
                onClick={() => navigate("/customerdashboard")}
                className="ml-2 text-green-400 hover:underline"
              >
                Go back to shop
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const discounted =
                item.product.discount > 0
                  ? (
                      (item.product.price * (100 - item.product.discount)) /
                      100
                    ).toFixed(2)
                  : null;

              return (
                <div
                  key={`${item.product._id}-${item.size}`}
                  className="flex items-center gap-4 bg-zinc-800 rounded-xl p-4 shadow-md hover:shadow-xl transition"
                >
                  <img
                    src={item.product.imageUrl || "/fallback.png"}
                    alt={item.product.name}
                    className="w-24 h-24 object-contain rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {item.product.brand}
                    </p>
                    <p className="text-sm text-gray-400">
                      Size: <span className="text-white">{item.size}</span>
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => decreaseQty(item.product._id, item.size)}
                        className="w-8 h-8 rounded-full bg-green-700 hover:bg-green-600 text-white font-bold"
                      >
                        −
                      </button>
                      <span className="text-lg font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQty(item.product._id, item.size)}
                        className="w-8 h-8 rounded-full bg-green-700 hover:bg-green-600 text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        removeFromCart(item.product._id, item.size)
                      }
                      className="mt-2 text-sm text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-right">
                    {discounted ? (
                      <div>
                        <div className="text-green-400 text-lg font-semibold">
                          {discounted} dh
                        </div>
                        <div className="text-xs text-gray-500 line-through">
                          {item.product.price} dh
                        </div>
                      </div>
                    ) : (
                      <div className="text-green-400 text-lg font-semibold">
                        {item.product.price} dh
                      </div>
                    )}
                    <div className="text-sm text-gray-400">
                      Total:{" "}
                      {(discounted || item.product.price) * item.quantity} dh
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        {cart.length > 0 && (
          <div className="bg-zinc-900 p-6 rounded-xl shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between text-sm mb-2">
                <span>Total Items:</span>
                <span>{totalCount}</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total Price:</span>
                <span>{totalPrice.toFixed(2)} dh</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => navigate("/customerdashboard")}
                className="w-full bg-transparent border border-green-500 text-green-400 rounded-full py-2 hover:bg-green-500 hover:text-black transition"
              >
                ← Continue Shopping
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-green-500 text-black rounded-full py-2 font-semibold hover:bg-green-600 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
