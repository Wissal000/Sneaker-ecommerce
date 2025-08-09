import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { MdShoppingCart } from "react-icons/md";

export default function Header() {
  const { totalCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-10 px-6 py-3 flex items-center justify-between text-white">
      {/* Brand Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-green-500 tracking-tight select-none no-underline"
      >
        Snex
      </Link>

      {/* Cart Icon */}
      <button
        onClick={() => navigate("/cart")}
        className="relative p-1 rounded hover:bg-green-600 transition"
        aria-label="Go to cart"
      >
        <MdShoppingCart className="w-7 h-7" />
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
            {totalCount}
          </span>
        )}
      </button>
    </header>
  );
}
