import React from "react";
import { motion } from "motion/react";
import { AlertCircle, Sparkles } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../../hooks/useProducts";

export function NewArrivals() {
  const { products, loading, error } = useProducts(1, "");
  const newProducts = products.filter((product) => product.isNew);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-emerald-200" />
            <span className="text-emerald-200 font-semibold uppercase tracking-widest text-sm">Fresh Arrivals</span>
            <Sparkles className="w-6 h-6 text-emerald-200" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">New Arrivals</h1>
          <p className="text-emerald-100 max-w-lg mx-auto">
            Discover the latest styles just added to our collection. Be the first to wear the newest trends!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-gray-500 text-sm mb-6">{newProducts.length} new products</p>
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-gray-200 rounded-2xl animate-pulse" style={{ paddingBottom: "120%" }} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Failed to load products</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && newProducts.length === 0 && (
          <p className="text-center text-gray-500 py-12">No new arrivals available.</p>
        )}

        {!loading && !error && newProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

