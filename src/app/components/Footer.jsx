import React from "react";
import { Link } from "react-router";
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">
                Garment<span className="text-rose-400">X</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Your one-stop destination for premium fashion. Discover the latest trends for men, women, and kids.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home", path: "/" },
                { label: "Shop All", path: "/shop" },
                { label: "Men", path: "/men" },
                { label: "Women", path: "/women" },
                { label: "Kids", path: "/kids" },
                { label: "New Arrivals", path: "/new-arrivals" },
                { label: "Offers", path: "/offers" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-rose-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2.5">
              {[
                { label: "My Account", path: "/login" },
                { label: "My Orders", path: "/orders" },
                { label: "Cart", path: "/cart" },
                { label: "Track Order", path: "/contact" },
                { label: "Return Policy", path: "/contact" },
                { label: "Size Guide", path: "/shop" },
                { label: "Contact Us", path: "/contact" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-rose-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  GarmentX HQ, Fashion Street,<br />
                  Mumbai, Maharashtra 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-sm text-gray-400 hover:text-rose-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <a href="mailto:support@garmentx.com" className="text-sm text-gray-400 hover:text-rose-400 transition-colors">
                  support@garmentx.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">We Accept</p>
              <div className="flex gap-2 flex-wrap">
                {["Visa", "Mastercard", "UPI", "Razorpay", "COD"].map((p) => (
                  <span
                    key={p}
                    className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded font-medium"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} GarmentX. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/contact" className="text-xs text-gray-500 hover:text-rose-400 transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="text-xs text-gray-500 hover:text-rose-400 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-xs text-gray-500 hover:text-rose-400 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

