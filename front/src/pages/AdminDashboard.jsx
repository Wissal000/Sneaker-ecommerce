import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminProductDashboard() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    color: "",
    sizes: "",
    price: "",
    discount: "",
    stock: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4040/product");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      color: product.color || "",
      sizes: product.sizes?.join(", ") || "",
      price: product.price,
      discount: product.discount,
      stock: JSON.stringify(product.stock || {}),
    });
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        ...formData,
        sizes: formData.sizes.split(",").map((s) => s.trim()),
        stock: JSON.parse(formData.stock),
      };

      await axios.put(
        `http://localhost:4040/product/${editProduct._id}`,
        updatedData
      );
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const res = await axios.delete(`http://localhost:4040/product/${id}`);
      toast.success(res.data.message || "Product deleted!");
      fetchProducts(); // Refresh your product list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="relative min-h-screen text-white py-16 px-6 overflow-x-auto">
      <div className="relative z-10">
        <h2 className="text-3xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-black via-green-700 to-green-400">
          Admin Dashboard
        </h2>
        {editProduct && (
          <div className="bg-[#1c1c1c] p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Edit Product: {editProduct.name}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                "name",
                "brand",
                "category",
                "color",
                "sizes",
                "price",
                "discount",
                "stock",
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field}
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  className="bg-[#111] text-white border border-[#333] p-2 rounded"
                />
              ))}
            </div>
            <div className="mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditProduct(null)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <table className="min-w-full text-sm bg-[#111] rounded-xl overflow-hidden border border-[#333]">
          <thead className="bg-[#1c1c1c] text-left text-gray-400">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Category</th>
              <th className="p-4">Color</th>
              <th className="p-4">Sizes</th>
              <th className="p-4">Price</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-t border-[#222] hover:bg-[#1a1a1a]"
              >
                <td className="p-4">
                  <img
                    src={product.imageUrl || "/fallback.png"}
                    alt={product.name}
                    className="w-16 h-16 object-contain rounded"
                    onError={(e) => (e.target.src = "/fallback.png")}
                  />
                </td>
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4">{product.brand}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">{product.color || "—"}</td>
                <td className="p-4">{product.sizes?.join(", ") || "—"}</td>
                <td className="p-4">{product.price} dh</td>
                <td className="p-4">
                  {product.discount > 0 ? (
                    <span className="text-red-400">-{product.discount}%</span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-4">
                  {product.stock ? (
                    <div className="space-y-1 text-xs text-gray-300">
                      {Object.entries(product.stock).map(([size, qty]) => (
                        <div key={size} className="flex justify-between">
                          <span>Size {size}</span>
                          <span
                            className={
                              qty > 0 ? "text-green-400" : "text-red-400"
                            }
                          >
                            {qty > 0 ? qty : "Out"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="inline-flex items-center gap-2 bg-transparent border border-green-500 text-green-500 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-green-500 hover:text-white transition"
                      aria-label={`Edit ${product.name}`}
                    >
                      {/* Optional icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5h6m-6 4h6m-6 4h6m-6 4h6M6 6v12"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="inline-flex items-center gap-2 bg-transparent border border-red-500 text-red-500 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-500 hover:text-white transition"
                      aria-label={`Delete ${product.name}`}
                    >
                      {/* Optional icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
