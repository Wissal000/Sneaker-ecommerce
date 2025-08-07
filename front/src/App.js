import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "./context/CartContext";
import Header from "./pages/Header";

// Pages
import Home from "./pages/Home";
import CustomerDashboard from "./pages/CustomerDashboard";
import CartPage from "./pages/CartPage";
import CheckOut from "./pages/CheckOut";
import AdminView from "./pages/AdminView";

function App() {
  const location = useLocation();

  // Define the routes where Header should be hidden
  const hideHeaderRoutes = ["/", "/AdminView"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <CartProvider>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
          newestOnTop={false}
          toastClassName="bg-white bg-opacity-20 backdrop-blur-md border border-green-500 text-green-100 rounded-lg shadow-lg px-6 py-3 font-medium"
          bodyClassName="text-sm"
          closeButton={false}
        />
        {!shouldHideHeader && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customerdashboard" element={<CustomerDashboard />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/AdminView" element={<AdminView />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
