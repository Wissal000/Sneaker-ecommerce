import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import backgroundAdd from "../assets/backgroundAdd.png";

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
    <div className="min-h-screen bg-black relative flex justify-center items-center p-6 overflow-hidden">
      {/* Background layer */}
      <div
        className="absolute inset-0 bg-repeat bg-[length:200px_200px] bg-center opacity-20 z-0"
        style={{ backgroundImage: `url(${backgroundAdd})` }}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-black/40 border border-green-500 shadow-xl p-8 rounded-xl w-full max-w-2xl space-y-6 text-white backdrop-blur-sm"
      >
        <h2 className="font-playfair text-3xl font-bold text-green-500 text-center">
          Add New Sneaker
        </h2>

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
            className="placeholder:italic w-full bg-black text-white border border-green-600 placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        ))}

        {/* Size Input */}
        <div>
          <label className="block font-medium text-green-400 mb-1">Sizes</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              placeholder="Add size (e.g., 40)"
              className="placeholder:italic bg-black text-white border border-green-600 px-3 py-1 rounded focus:ring-1 focus:ring-green-400"
            />
            <div class="relative group overflow-hidden bg-white/20 p-0.5 h-9 w-20 rounded-md active:scale-100 hover:scale-105 transition-all duration-300">
              <button
                type="button"
                onClick={handleAddSize}
                class="text-white text-sm bg-gradient-to-t from-black/50 to-black h-full w-full rounded group-hover:bg-green-500"
              >
                Add Size
              </button>
              <div class="absolute -bottom-12 group-hover:-bottom-10 transition-all duration-200 left-1/2 -z-10 -translate-x-1/2 blur size-14 rounded-full bg-white"></div>
            </div>
          </div>

          {/* Sizes with stock inputs */}
          <div className="mt-4 space-y-2">
            {form.sizes.map((size) => (
              <div key={size} className="flex items-center gap-4">
                <span className="font-small text-green-700">Size {size}</span>
                <input
                  type="number"
                  min={0}
                  value={form.stock[size] || ""}
                  onChange={(e) => handleStockChange(size, e.target.value)}
                  placeholder="Stock"
                  className="bg-black text-white border border-green-600 px-3 py-1 rounded w-24"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label className="block font-medium text-green-600 mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full bg-black text-white file:bg-green-800 file:text-white file:rounded file:px-4 file:py-1 file:mr-4 border border-green-800 rounded"
          />
        </div>

        {/* Submit */}
        <div class="button-bg flex justify-center items-center rounded-full p-0.5 hover:scale-105 transition duration-300 active:scale-100">
          <button
            type="submit"
            class="Outfit px-8 text-sm py-2.5 text-white rounded-full font-medium bg-gray-800"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
