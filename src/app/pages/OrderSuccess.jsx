import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import { CheckCircle, Package, Truck, Home, ShoppingBag, Download } from "lucide-react";
import { useOrders } from "../context/OrderContext";
import confetti from "canvas-confetti";

export function OrderSuccess() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();
  const order = getOrderById(orderId || "");
  const fired = useRef(false);

  const progressWidth = order
    ? order.status === "delivered"
      ? "100%"
      : order.status === "shipped"
      ? "75%"
      : order.status === "processing"
      ? "50%"
      : "25%"
    : "0%";

  useEffect(() => {
    if (!fired.current) {
      fired.current = true;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f43f5e", "#fb923c", "#fbbf24", "#34d399", "#60a5fa"],
      });
    }
  }, []);

  const steps = [
    { icon: CheckCircle, label: "Order Placed", done: true },
    { icon: Package, label: "Processing", done: order?.status === "processing" || order?.status === "shipped" || order?.status === "delivered" },
    { icon: Truck, label: "Shipped", done: order?.status === "shipped" || order?.status === "delivered" },
    { icon: Home, label: "Delivered", done: order?.status === "delivered" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-14 h-14 text-emerald-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed Successfully! 🎉</h1>
          <p className="text-gray-500 mb-2">
            Thank you for shopping with GarmentX!
          </p>
          {order && (
            <p className="text-sm text-gray-500 mb-8">
              Order ID: <span className="font-bold text-gray-800">{order.id}</span>
            </p>
          )}
        </motion.div>

        {/* Order Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
        >
          <h2 className="text-base font-bold text-gray-900 mb-6">Order Status</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-emerald-500 z-0 transition-all"
              style={{ width: progressWidth }}
            />
            {steps.map(({ icon: Icon, label, done }, i) => (
              <div key={i} className="flex flex-col items-center gap-2 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    done
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${done ? "text-emerald-600" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-6">
            Estimated delivery: <span className="font-semibold text-gray-700">3-5 business days</span>
          </p>
        </motion.div>

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 text-left"
          >
            <h2 className="text-base font-bold text-gray-900 mb-4">Order Details</h2>

            {/* Items */}
            <div className="space-y-3 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-16 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} | Size: {item.selectedSize}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-100 pt-4 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className={order.deliveryCharge === 0 ? "text-emerald-600 font-medium" : "font-medium"}>
                  {order.deliveryCharge === 0 ? "FREE" : `₹${order.deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">GST (18%)</span>
                <span className="font-medium">₹{order.gst.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1 border-t border-gray-100">
                <span>Grand Total</span>
                <span className="text-rose-600">₹{order.grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              <p className="text-xs font-semibold text-gray-600 mb-1">Delivering to:</p>
              <p className="text-sm font-semibold text-gray-800">{order.address.name}</p>
              <p className="text-sm text-gray-500">
                {order.address.addressLine1}, {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
            </div>

            {/* Payment */}
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                ✓ PAID
              </span>
              <span className="text-xs text-gray-500">Payment ID: {order.paymentId}</span>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            to="/orders"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-rose-500 text-rose-600 rounded-2xl font-bold hover:bg-rose-50 transition-all"
          >
            <Package className="w-5 h-5" />
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

