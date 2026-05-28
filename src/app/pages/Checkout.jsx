import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { CreditCard, Smartphone, Building2, Truck, ChevronRight, Lock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { toast } from "sonner";

const GST_RATE = 0.18;
const DELIVERY_CHARGE = 79;
const FREE_DELIVERY_THRESHOLD = 999;

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh",
];

export function Checkout() {
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
  });

  const subtotal = state.totalPrice;
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const gst = Math.round(subtotal * GST_RATE);
  const grandTotal = subtotal + deliveryCharge + gst;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const required = ["name", "phone", "email", "addressLine1", "city", "state", "pincode"];
    for (const field of required) {
      if (!address[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return;
      }
    }
    setStep(2);
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate Razorpay payment flow
    await new Promise((r) => setTimeout(r, 2500));

    // Create order
    const order = addOrder({
      userId: user?.id || "guest",
      items: state.items,
      subtotal,
      gst,
      deliveryCharge,
      grandTotal,
      status: "processing",
      paymentId: `pay_${Date.now()}`,
      paymentStatus: "paid",
      address,
    });

    clearCart();
    setIsProcessing(false);
    navigate(`/order-success/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-8">
          {["Delivery Address", "Payment"].map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > i + 1
                      ? "bg-emerald-500 text-white"
                      : step === i + 1
                      ? "bg-rose-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    step === i + 1 ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {s}
                </span>
              </div>
              {i < 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-6">Delivery Address</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full Name *</label>
                      <input
                        value={address.name}
                        onChange={(e) => setAddress((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Phone Number *</label>
                      <input
                        value={address.phone}
                        onChange={(e) => setAddress((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX"
                        maxLength={10}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address *</label>
                    <input
                      type="email"
                      value={address.email}
                      onChange={(e) => setAddress((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Address Line 1 *</label>
                    <input
                      value={address.addressLine1}
                      onChange={(e) => setAddress((prev) => ({ ...prev, addressLine1: e.target.value }))}
                      placeholder="House/Flat No., Building Name, Street"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Address Line 2</label>
                    <input
                      value={address.addressLine2 || ""}
                      onChange={(e) => setAddress((prev) => ({ ...prev, addressLine2: e.target.value }))}
                      placeholder="Area, Landmark (optional)"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">City *</label>
                      <input
                        value={address.city}
                        onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                        placeholder="City"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">State *</label>
                      <select
                        value={address.state}
                        onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors appearance-none"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Pincode *</label>
                      <input
                        value={address.pincode}
                        onChange={(e) => setAddress((prev) => ({ ...prev, pincode: e.target.value }))}
                        placeholder="6-digit pincode"
                        maxLength={6}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg mt-2"
                  >
                    Continue to Payment
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Address Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Delivering to</h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-rose-500 font-semibold hover:text-rose-700"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{address.name}</p>
                  <p className="text-sm text-gray-500">
                    {address.addressLine1}, {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-sm text-gray-500">{address.phone}</p>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-5">Payment Method</h2>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: "upi", icon: Smartphone, label: "UPI Payment", sub: "Pay using UPI apps like GPay, PhonePe, Paytm" },
                      { id: "card", icon: CreditCard, label: "Credit / Debit Card", sub: "Visa, Mastercard, Rupay accepted" },
                      { id: "netbanking", icon: Building2, label: "Net Banking", sub: "All major Indian banks supported" },
                      { id: "cod", icon: Truck, label: "Cash on Delivery", sub: "Pay when your order arrives" },
                    ].map(({ id, icon: Icon }) => (
                      <label
                        key={id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === id
                            ? "border-rose-500 bg-rose-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={id}
                          checked={paymentMethod === id}
                          onChange={() => setPaymentMethod(id)}
                          className="w-4 h-4 accent-rose-500"
                        />
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          paymentMethod === id ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-500"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{label}</p>
                          <p className="text-xs text-gray-500">{sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* UPI Input */}
                  {paymentMethod === "upi" && (
                    <div className="mb-5">
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">UPI ID *</label>
                      <input
                        placeholder="yourname@paytm / @gpay"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors"
                      />
                    </div>
                  )}

                  {/* Card Input */}
                  {paymentMethod === "card" && (
                    <div className="space-y-3 mb-5">
                      <input placeholder="Card Number" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors" />
                      <input placeholder="Cardholder Name" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors" />
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="MM/YY" className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors" />
                        <input placeholder="CVV" className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors" />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Pay ₹{grandTotal.toLocaleString("en-IN")} Securely
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Your payment is secured by Razorpay SSL encryption
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">
                  Order Summary ({state.totalItems} items)
                </h2>
              </div>
              <div className="p-5 space-y-3 max-h-64 overflow-y-auto">
                {state.items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-800 line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} | {item.selectedSize}</p>
                      <p className="text-xs font-bold text-gray-900">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  ) : (
                    <span className="font-semibold">₹{deliveryCharge}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold">₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Grand Total</span>
                  <span className="font-black text-lg text-gray-900">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

