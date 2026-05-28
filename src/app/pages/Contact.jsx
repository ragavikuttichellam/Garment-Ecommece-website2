import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you within 24 hours. 📧");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-orange-500 py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-black text-white mb-3">Get in Touch</h1>
          <p className="text-rose-100 max-w-lg mx-auto">
            Have questions about your order or our products? We're here to help!
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              {
                icon: Phone,
                title: "Phone",
                lines: ["+91 98765 43210", "+91 87654 32109"],
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: Mail,
                title: "Email",
                lines: ["support@garmentx.com", "orders@garmentx.com"],
                color: "bg-rose-50 text-rose-600",
              },
              {
                icon: MapPin,
                title: "Address",
                lines: ["GarmentX HQ, Fashion Street,", "Mumbai, Maharashtra 400001"],
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                icon: Clock,
                title: "Business Hours",
                lines: ["Mon – Sat: 9 AM – 7 PM", "Sunday: 10 AM – 4 PM"],
                color: "bg-amber-50 text-amber-600",
              },
            ].map(({ icon: Icon, title, lines, color }, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">{title}</p>
                  {lines.map((line, i) => (
                    <p key={i} className="text-sm text-gray-500">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h2>
                  <p className="text-gray-500 mb-6">
                    Thank you for reaching out! Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
                    }}
                    className="px-6 py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Your Name *</label>
                        <input
                          value={form.name}
                          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                          required
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                          required
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Phone Number</label>
                        <input
                          value={form.phone}
                          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="Your phone number"
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Subject *</label>
                        <select
                          value={form.subject}
                          onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                          required
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors appearance-none"
                        >
                          <option value="">Select a topic</option>
                          <option value="order">Order Enquiry</option>
                          <option value="return">Return/Exchange</option>
                          <option value="payment">Payment Issue</option>
                          <option value="product">Product Query</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Message *</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                        required
                        rows={5}
                        placeholder="Tell us how we can help you..."
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

