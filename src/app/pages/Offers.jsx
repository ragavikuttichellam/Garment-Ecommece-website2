import React from "react";
import { motion } from "motion/react";
import { AlertCircle, Tag, Zap } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../../hooks/useProducts";

export function Offers() {
  const { products, loading, error } = useProducts(1, "");
  const offerProducts = products.filter((product) => product.isOffer || product.discount > 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 py-14 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full" />
        <div className="absolute -right-10 -bottom-24 w-80 h-80 bg-white/5 rounded-full" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            <span className="text-rose-200 font-semibold uppercase tracking-widest text-sm">Hot Deals</span>
            <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            Exclusive Offers & Deals
          </h1>
          <p className="text-rose-100 max-w-lg mx-auto">
            Save big on trending styles! These deals won't last long — shop now before they're gone.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            {["Up to 50% OFF", "Free Delivery", "Easy Returns"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-white text-sm font-semibold">
                <Tag className="w-4 h-4 text-yellow-300" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-gray-500 text-sm mb-6">{offerProducts.length} products on sale</p>
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

        {!loading && !error && offerProducts.length === 0 && (
          <p className="text-center text-gray-500 py-12">No offers available.</p>
        )}

        {!loading && !error && offerProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {offerProducts.map((product, i) => (
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

