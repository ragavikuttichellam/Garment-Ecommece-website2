import React from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Truck,
  ChevronRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const GST_RATE = 0.18;
const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_CHARGE = 79;

export function Cart() {
  const { state, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const subtotal = state.totalPrice;
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const gst = Math.round(subtotal * GST_RATE);
  const grandTotal = subtotal + deliveryCharge + gst;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed to checkout");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm"
        >
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-rose-300" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added any items to your cart yet. Start shopping and find something you'll love!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 text-sm mt-1">{state.totalItems} item{state.totalItems > 1 ? "s" : ""}</p>
          </div>
          <Link to="/shop" className="text-sm text-rose-500 font-semibold hover:text-rose-700 flex items-center gap-1">
            Continue Shopping <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {state.items.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-28 sm:w-28 sm:h-32 object-cover rounded-xl"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-rose-500 font-medium">{item.product.brand}</p>
                          <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                            {item.product.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              Size: {item.selectedSize}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {item.selectedColor}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            removeFromCart(item.product.id);
                            toast.success("Item removed from cart");
                          }}
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white shadow-sm transition-all text-gray-600"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white shadow-sm transition-all text-gray-600"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-base font-black text-gray-900">
                            ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-gray-400">
                            ₹{item.product.price.toLocaleString("en-IN")} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Coupon */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-rose-500" />
                Apply Coupon
              </h3>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.info("Coupon code applied! (Demo mode)");
                }}
              >
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({state.totalItems} items)</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  ) : (
                    <span className="font-semibold text-gray-900">₹{deliveryCharge}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold text-gray-900">₹{gst.toLocaleString("en-IN")}</span>
                </div>

                {deliveryCharge > 0 && (
                  <div className="bg-rose-50 rounded-xl p-3">
                    <p className="text-xs text-rose-700">
                      Add items worth{" "}
                      <span className="font-bold">
                        ₹{(FREE_DELIVERY_THRESHOLD - subtotal).toLocaleString("en-IN")}
                      </span>{" "}
                      more to get FREE delivery!
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Grand Total</span>
                    <span className="font-black text-xl text-gray-900">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Inclusive of all taxes</p>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30 mt-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure checkout powered by Razorpay
                </div>
              </div>

              {/* Delivery Info */}
              <div className="p-5 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Truck className="w-4 h-4 text-rose-500" />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

