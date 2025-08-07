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
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 sm:px-10 py-16 overflow-x-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-black via-green-700 to-green-400">
        Customer Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-red-400 text-lg">No orders found.</p>
      ) : (
        <div className="overflow-auto rounded-xl shadow-md border border-white/10 backdrop-blur-lg">
          <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total (MAD)</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="bg-white/5 text-white hover:bg-white/10 transition duration-200"
                >
                  <td className="px-4 py-3 font-medium">
                    {order.customerInfo?.fullName || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {order.customerInfo?.email || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {order.customerInfo?.phoneNumber || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {order.customerInfo?.address || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <ul className="space-y-1">
                      {order.products.map((item, idx) => (
                        <li key={idx}>
                          <span className="text-blue-300">
                            {item.productId?.name || "Product"}
                          </span>{" "}
                          — {item.quantity}x, {item.size || "N/A"} —{" "}
                          <span className="text-green-400">
                            {item.priceAtPurchase} MAD
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-bold text-green-400">
                    {order.totalAmount} MAD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
