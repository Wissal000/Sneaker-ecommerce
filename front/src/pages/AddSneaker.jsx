import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddSneaker() {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    discount: "",
    description: "",
    category: "",
    color: "",
    sizes: [],
    stock: {},
  });

  const [sizeInput, setSizeInput] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSize = () => {
    const size = parseInt(sizeInput);
    if (!isNaN(size) && !form.sizes.includes(size)) {
      setForm((prev) => ({
        ...prev,
        sizes: [...prev.sizes, size],
        stock: { ...prev.stock, [size]: 0 },
      }));
    }
    setSizeInput("");
  };

  const handleStockChange = (size, value) => {
    setForm((prev) => ({
      ...prev,
      stock: { ...prev.stock, [size]: parseInt(value) || 0 },
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in form) {
      if (key === "sizes" || key === "stock") {
        formData.append(key, JSON.stringify(form[key]));
      } else {
        formData.append(key, form[key]);
      }
    }
    formData.append("image", image);

    try {
      await axios.post("http://localhost:4040/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product uploaded!");
      setForm({
        name: "",
        brand: "",
        price: "",
        discount: "",
        description: "",
        category: "",
        color: "",
        sizes: [],
        stock: {},
      });
      setImage(null);
      navigate("/admindashboard");
    } catch (err) {
      toast.error("❌ Upload failed");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-black/40 border border-green-500 p-10 rounded-xl backdrop-blur-md shadow-2xl space-y-8"
      >
        <h2 className="text-center text-3xl font-bold text-green-500 font-playfair">
          Add New Sneaker
        </h2>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            "name",
            "brand",
            "price",
            "discount",
            "description",
            "category",
            "color",
          ].map((field) => (
            <input
              key={field}
              type={["price", "discount"].includes(field) ? "number" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              required={["name", "price", "category"].includes(field)}
              className="w-full px-4 py-2 bg-black border border-green-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          ))}
        </div>

        {/* Sizes Section */}
        <div className="space-y-4">
          <label className="text-green-400 font-semibold">Sizes</label>
          <div className="flex gap-4 items-center">
            <input
              type="number"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              placeholder="e.g. 40"
              className="px-3 py-2 bg-black border border-green-600 rounded placeholder-gray-400"
            />
            <button
              type="button"
              onClick={handleAddSize}
              className="bg-green-800 hover:bg-green-900 px-4 py-2 text-white rounded-md transition"
            >
              Add Size
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {form.sizes.map((size) => (
              <div key={size} className="flex items-center gap-3">
                <span className="text-green-300 font-medium">Size {size}</span>
                <input
                  type="number"
                  min={0}
                  value={form.stock[size] || ""}
                  onChange={(e) => handleStockChange(size, e.target.value)}
                  placeholder="Stock"
                  className="px-3 py-1 w-24 bg-black border border-green-600 rounded placeholder-gray-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-green-400 font-semibold">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="block w-full text-sm text-white bg-black border border-green-800 rounded file:px-4 file:py-1 file:mr-4 file:bg-green-800 file:text-white file:rounded"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-8 py-2.5 text-white bg-green-900 hover:bg-green-800 rounded-full font-medium transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
