import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { MdShoppingCart } from "react-icons/md";

export default function Header() {
  const { totalCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between z-50">
      {/* Brand Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-green-500 tracking-tight no-underline"
      >
        Snex
      </Link>

      {/* Cart Icon */}
      <button
        onClick={() => navigate("/cart")}
        className="relative text-white hover:text-green-400 transition duration-200"
        aria-label="Go to cart"
      >
        <MdShoppingCart className="w-7 h-7" />
        {totalCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            {totalCount}
          </span>
        )}
      </button>
    </header>
  );
}
