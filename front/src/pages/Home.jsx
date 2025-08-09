import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Home() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4040/user/login", {
        email: loginEmail,
        password: loginPassword,
      });
      toast.success("Login successful");
      localStorage.setItem("token", res.data.token);
      navigate("/customerdashboard");
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4040/user/register", {
        userName: regName,
        email: regEmail,
        password: regPassword,
      });
      toast.success("User Created Successfully");
      setIsLogin(true);
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative w-full h-screen bg-black font-exo text-white overflow-hidden flex items-center justify-center">
      {/* Abstract Animated Background Circles */}
      <div className="absolute w-[800px] h-[800px] bg-green-800/20 rounded-full blur-3xl top-[-200px] left-[-200px] animate-pulse z-0" />
      <div className="absolute w-[600px] h-[600px] bg-green-600/10 rounded-full blur-2xl bottom-[-150px] right-[-150px] animate-ping z-0" />

      {/* Auth Card */}
      <div className="relative z-10 w-[70%] max-w-4xl bg-white/5 backdrop-blur-2xl border border-green-900/40 rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left panel */}
        <div className="w-1/2 bg-gradient-to-b from-green-800 to-green-950 text-white flex flex-col justify-center items-center p-12 space-y-6">
          <h1 className="text-6xl font-black tracking-widest">SNEX</h1>
          <p className="text-center text-lg opacity-80">
            {isLogin
              ? "Welcome back, sneakerhead! Log in to your kicks collection."
              : "New here? Create an account and cop your first pair now!"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 px-8 py-3 border-2 border-white rounded-full hover:bg-white hover:text-green-900 transition duration-300 font-bold tracking-wide"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>

        {/* Right panel (forms) */}
        <div className="w-1/2 flex items-center justify-center p-12 relative">
          <div className="w-full max-w-md relative" style={{ minHeight: 440 }}>
            {/* Login Form */}
            <form
              onSubmit={handleLogin}
              className={`absolute inset-0 flex flex-col gap-6 transition-all duration-500 ${
                isLogin
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
              noValidate
            >
              <h2 className="text-4xl font-bold">Login</h2>
              <Input
                label="Email"
                type="email"
                value={loginEmail}
                onChange={setLoginEmail}
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                type="password"
                value={loginPassword}
                onChange={setLoginPassword}
                placeholder="•••••••••"
              />
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white py-3 rounded-full font-bold text-lg shadow-md transition duration-300"
              >
                Login
              </button>
            </form>

            {/* Register Form */}
            <form
              onSubmit={handleRegister}
              className={`absolute inset-0 flex flex-col gap-6 transition-all duration-500 ${
                !isLogin
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
              noValidate
            >
              <h2 className="text-4xl font-bold">Register</h2>
              <Input
                label="Full Name"
                type="text"
                value={regName}
                onChange={setRegName}
                placeholder="John Doe"
              />
              <Input
                label="Email"
                type="email"
                value={regEmail}
                onChange={setRegEmail}
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                type="password"
                value={regPassword}
                onChange={setRegPassword}
                placeholder="Create a password"
              />
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white py-3 rounded-full font-bold text-lg shadow-md transition duration-300"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, type, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-neutral-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-md bg-neutral-800 text-white placeholder-neutral-500 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
    </div>
  );
}
