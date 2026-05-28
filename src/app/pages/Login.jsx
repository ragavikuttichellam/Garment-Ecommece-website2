import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    const ok = await login(form.email, form.password);
    setIsLoading(false);
    if (ok) {
      toast.success("Welcome back! 👋");
      navigate("/");
    } else {
      toast.error("Invalid email or password");
    }
  };

  const fillDemo = (role) => {
    if (role === "admin") {
      setForm({ email: "admin@garmentx.com", password: "admin123" });
    } else {
      setForm({ email: "user@garmentx.com", password: "user123" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Login to your GarmentX account</p>
          </div>

          {/* Demo Buttons */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => fillDemo("user")}
              className="flex-1 py-2 text-xs font-semibold bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200"
            >
              Demo User
            </button>
            <button
              onClick={() => fillDemo("admin")}
              className="flex-1 py-2 text-xs font-semibold bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors border border-amber-200"
            >
              Demo Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 rounded-xl border text-sm outline-none transition-colors ${
                    errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-rose-400"
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3.5 bg-gray-50 rounded-xl border text-sm outline-none transition-colors ${
                    errors.password ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-rose-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-xs text-rose-500 font-semibold hover:text-rose-700">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-rose-500 font-semibold hover:text-rose-700">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

