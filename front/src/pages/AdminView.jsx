import { useState } from "react";
import { Link } from "react-router-dom";
import OrdersInfo from "./CustomerOrders";
import AddSneaker from "./AddSneaker";
import AdminDashboard from "./AdminDashboard";

export default function AdminLayout() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "orders":
        return <OrdersInfo />;
      case "addProduct":
        return <AddSneaker />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Glassmorphism Top Nav */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-black/70 border-b border-white/10 shadow-md px-8 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="no-underline hover:no-underline focus:no-underline font-playfair text-2xl font-extrabold text-green-500 tracking-wider select-none"
        >
          Snex Admin
        </Link>

        <nav className="flex space-x-4">
          <NavButton
            active={activePage === "dashboard"}
            onClick={() => setActivePage("dashboard")}
            label="Dashboard"
          />
          <NavButton
            active={activePage === "orders"}
            onClick={() => setActivePage("orders")}
            label="Orders"
          />
          <NavButton
            active={activePage === "addProduct"}
            onClick={() => setActivePage("addProduct")}
            label="Add Sneaker"
          />
        </nav>
      </header>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto p-6 mt-6 rounded-2xl bg-[#111] border border-white/10 shadow-lg min-h-[80vh]">
        {renderPage()}
      </main>
    </div>
  );
}

function NavButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 
        ${
          active
            ? "bg-green-500 text-black shadow-md shadow-green-600/50"
            : "bg-white/5 text-gray-300 hover:bg-green-600 hover:text-white"
        }`}
    >
      {label}
    </button>
  );
}
