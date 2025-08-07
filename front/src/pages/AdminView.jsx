import { useState } from "react";
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
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-gray-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full bg-black bg-opacity-90 border-b border-green-600 px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="font-playfair text-2xl font-extrabold text-green-400 tracking-wide select-none">
          Welcome Admin
        </div>
        <nav className="flex space-x-6">
          <NavButton
            active={activePage === "dashboard"}
            onClick={() => setActivePage("dashboard")}
            label="Dashboard"
          />
          <NavButton
            active={activePage === "orders"}
            onClick={() => setActivePage("orders")}
            label="Customer Orders"
          />
          <NavButton
            active={activePage === "addProduct"}
            onClick={() => setActivePage("addProduct")}
            label="Add Product"
          />
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8 mt-6 rounded-lg bg-gray-900 bg-opacity-60 shadow-xl min-h-[80vh]">
        {renderPage()}
      </main>
    </div>
  );
}

function NavButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-md font-semibold text-sm tracking-wide transition-colors duration-300 ${
        active
          ? "bg-green-600 text-white shadow-lg shadow-green-700/60"
          : "text-green-300 hover:bg-green-700 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
