import React from "react";
import { useLocation } from "react-router";
import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../../hooks/useProducts";

const CATEGORY_META = {
  men: {
    title: "Men's Collection",
    desc: "Discover the finest men's fashion from casual tees to formal blazers.",
    banner:
      "https://images.unsplash.com/photo-1771919322950-8b9500607616?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
    color: "from-blue-900/80",
  },
  women: {
    title: "Women's Collection",
    desc: "Explore elegant styles crafted for every woman, sarees, kurtis, dresses and more.",
    banner:
      "https://images.unsplash.com/photo-1637328603774-9d7604a7748f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
    color: "from-rose-900/80",
  },
  kids: {
    title: "Kids' Collection",
    desc: "Fun, colourful and comfortable clothing designed to let kids be kids.",
    banner:
      "https://images.unsplash.com/photo-1560859259-fcf2b952aed8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
    color: "from-amber-900/80",
  },
};

export function CategoryPage() {
  const location = useLocation();
  const cat = location.pathname.replace("/", "");
  const meta = CATEGORY_META[cat] || CATEGORY_META.men;
  const { products, loading, error } = useProducts(1, "");
  const categoryProducts = products.filter((product) => product.category === cat);

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative h-56 sm:h-72 flex items-center"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 50%), url('${meta.banner}') center/cover no-repeat`,
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">{meta.title}</h1>
            <p className="text-white/80 max-w-md">{meta.desc}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-500 text-sm">{categoryProducts.length} products</p>
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="bg-gray-200 rounded-2xl animate-pulse"
                style={{ paddingBottom: "120%" }}
              />
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

        {!loading && !error && categoryProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}

        {!loading && !error && categoryProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryProducts.map((product, i) => (
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
