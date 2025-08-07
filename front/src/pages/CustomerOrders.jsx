import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:4040/order");
        setOrders(res.data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-xl">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-6 py-16 bg-black text-white overflow-hidden">
      {/* Vibrant blurred circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-green-500 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute top-0 right-[-80px] w-[200px] h-[200px] bg-pink-500 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute bottom-[-120px] left-[20%] w-[250px] h-[250px] bg-blue-500 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative z-10">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-pink-400">
          Customer Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-red-400 text-lg">No orders found.</p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-lg p-6 space-y-5 transition-transform hover:scale-[1.02]"
              >
                {/* Customer Info */}
                <div>
                  <h2 className="text-pink-400 font-semibold text-lg mb-1">👤 Customer</h2>
                  <p><span className="text-gray-400">Name:</span> {order.customerInfo?.fullName || "N/A"}</p>
                  <p><span className="text-gray-400">Email:</span> {order.customerInfo?.email || "N/A"}</p>
                  <p><span className="text-gray-400">Phone:</span> {order.customerInfo?.phoneNumber || "N/A"}</p>
                  <p><span className="text-gray-400">Address:</span> {order.customerInfo?.address || "N/A"}</p>
                </div>

                {/* Products */}
                <div>
                  <h2 className="text-blue-400 font-semibold text-lg mb-1">🛒 Products</h2>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {order.products.map((item, idx) => (
                      <li key={idx}>
                        {item.productId?.name || "Product"} — {item.quantity}x, Size: {item.size || "N/A"} <span className="text-green-400">({item.priceAtPurchase} MAD)</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status + Total */}
                <div className="border-t border-white/10 pt-4 text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        order.status === "pending"
                          ? "bg-yellow-600 text-yellow-100"
                          : order.status === "confirmed"
                          ? "bg-green-700 text-green-100"
                          : "bg-gray-600 text-white"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="font-semibold">Total:</span>
                    <span className="text-green-300 font-bold">{order.totalAmount} MAD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
