import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, User, Phone, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone) e.phone = "Phone is required";
    else if (form.phone.length !== 10) e.phone = "Phone must be 10 digits";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    const ok = await register(form.name, form.email, form.password, form.phone);
    setIsLoading(false);
    if (ok) {
      toast.success("Account created successfully! Welcome to GarmentX");
      navigate("/");
    } else {
      toast.error("Registration failed. Please check backend server and try again.");
    }
  };

  const Field = ({
    name,
    type = "text",
    icon: Icon,
    placeholder,
    maxLength,
    rightEl,
  }) => {
    const labelText =
      name === "confirm"
        ? "Confirm Password"
        : name.charAt(0).toUpperCase() + name.slice(1);

    return (
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block capitalize">
          {labelText}
        </label>
        <div className="relative">
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={type}
            value={form[name]}
            onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`w-full pl-10 ${rightEl ? "pr-12" : "pr-4"} py-3.5 bg-gray-50 rounded-xl border text-sm outline-none transition-colors ${
              errors[name] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-rose-400"
            }`}
          />
          {rightEl && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</div>
          )}
        </div>
        {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join GarmentX and start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field name="name" icon={User} placeholder="Your full name" />
            <Field name="email" type="email" icon={Mail} placeholder="your@email.com" />
            <Field name="phone" icon={Phone} placeholder="10-digit phone number" maxLength={10} />
            <Field
              name="password"
              type={showPass ? "text" : "password"}
              icon={Lock}
              placeholder="Min 6 characters"
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <Field
              name="confirm"
              type={showPass ? "text" : "password"}
              icon={Lock}
              placeholder="Re-enter your password"
            />

            <p className="text-xs text-gray-400">
              By signing up, you agree to our{" "}
              <span className="text-rose-500 cursor-pointer">Terms of Service</span> and{" "}
              <span className="text-rose-500 cursor-pointer">Privacy Policy</span>.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-rose-500 font-semibold hover:text-rose-700">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
