import React, { useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  ShoppingBag,
  Star,
  Truck,
  RefreshCw,
  Shield,
  Headphones,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../../hooks/useProducts";

const HERO_BG =
  "https://images.unsplash.com/photo-1762801637866-b13aac07e92d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920";

const COLLECTIONS = [
  {
    label: "Men",
    path: "/men",
    image:
      "https://images.unsplash.com/photo-1771919322950-8b9500607616?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    color: "from-blue-900/70 to-blue-900/20",
    accent: "bg-blue-500",
    desc: "Premium Men's Fashion",
  },
  {
    label: "Women",
    path: "/women",
    image:
      "https://images.unsplash.com/photo-1637328603774-9d7604a7748f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    color: "from-rose-900/70 to-rose-900/20",
    accent: "bg-rose-500",
    desc: "Elegant Women's Wear",
  },
  {
    label: "Kids",
    path: "/kids",
    image:
      "https://images.unsplash.com/photo-1560859259-fcf2b952aed8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    color: "from-amber-900/70 to-amber-900/20",
    accent: "bg-amber-500",
    desc: "Fun Kids Collection",
  },
];

const FEATURES = [
  { icon: Truck, title: "Free Delivery", desc: "On orders above ₹999" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day hassle-free return" },
  { icon: Shield, title: "Secure Payment", desc: "100% secure transactions" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated customer care" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Amazing quality! The fabric feels premium and the stitching is perfect. GarmentX has become my go-to for all fashion needs.",
    avatar: "P",
  },
  {
    name: "Rahul Verma",
    location: "Delhi",
    rating: 5,
    text: "Super fast delivery and the clothes look exactly like the photos. Great experience overall!",
    avatar: "R",
  },
  {
    name: "Sneha Patel",
    location: "Ahmedabad",
    rating: 5,
    text: "Best prices for premium quality. I've ordered multiple times and the consistency is impressive!",
    avatar: "S",
  },
];

export function Home() {
  const navigate = useNavigate();
  const shopRef = useRef(null);

  // Fetch products from API
  const {
    products: apiProducts,
    loading: productsLoading,
    error: productsError,
  } = useProducts(1, "");

  // Use first 4 products as new arrivals, first 8 as featured
  const newArrivals = apiProducts.slice(0, 4);
  const featured = apiProducts.slice(0, 8);

  return (
    <main className="bg-gray-50">
      {/* ─── Hero Section ─── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(255,20,147,0.4) 0%, rgba(0,0,0,0.25) 100%), url('${HERO_BG}') center/cover no-repeat`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/20 border border-rose-400/30 rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
              <span className="text-rose-300 text-sm font-medium">
                New Collection 2026
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              Upgrade Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                Style with
              </span>
              <br />
              GarmentX
            </h1>

            <p className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed">
              Discover the finest collection of men's, women's and kids'
              fashion. Premium quality at unbeatable prices with fast delivery
              across India.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="flex items-center gap-2 px-8 py-4 bg-rose-500 text-white rounded-2xl font-bold text-lg hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30 hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/new-arrivals"
                className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                New Arrivals
              </Link>
            </div>

            <div className="flex gap-8 mt-12">
              {[
                { value: "50K+", label: "Happy Customers" },
                { value: "5000+", label: "Products" },
                { value: "4.9★", label: "Avg Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-gray-400 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex flex-col gap-4"
          >
            {[
              { emoji: "🔥", title: "Hot Deals", sub: "Up to 50% off" },
              { emoji: "✨", title: "New Arrivals", sub: "Fresh styles daily" },
              { emoji: "🚚", title: "Free Shipping", sub: "Orders above ₹999" },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer"
                onClick={() => navigate("/shop")}
              >
                <span className="text-3xl">{card.emoji}</span>
                <div>
                  <p className="text-white font-bold">{card.title}</p>
                  <p className="text-gray-300 text-sm">{card.sub}</p>
                </div>
                <ChevronRight className="ml-auto text-white/50 w-5 h-5" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-white/50 text-xs">Scroll</span>
          <div className="w-0.5 h-6 bg-white/30 rounded-full" />
        </div>
      </section>

      {/* ─── Features Bar ─── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Collections ─── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-rose-500 text-sm font-semibold uppercase tracking-widest mb-2">
            Shop by Category
          </p>
          <h2 className="text-4xl font-black text-gray-900 mb-3">
            Explore Our Collections
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Find the perfect style for every occasion across our curated
            collections.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {COLLECTIONS.map((col, i) => (
            <motion.div
              key={col.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link
                to={col.path}
                className="group relative overflow-hidden rounded-3xl block"
                style={{ paddingBottom: "130%" }}
              >
                <img
                  src={col.image}
                  alt={col.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${col.color}`}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span
                    className={`inline-block w-8 h-1 ${col.accent} rounded-full mb-3`}
                  />
                  <h3 className="text-3xl font-black text-white mb-1">
                    {col.label}
                  </h3>
                  <p className="text-white/80 text-sm mb-4">{col.desc}</p>
                  <span className="inline-flex items-center gap-2 text-white text-sm font-semibold bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 w-fit group-hover:bg-white group-hover:text-gray-900 transition-all">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── New Arrivals ─── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-rose-500 text-sm font-semibold uppercase tracking-widest mb-1">
                Fresh Picks
              </p>
              <h2 className="text-3xl font-black text-gray-900">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/new-arrivals"
              className="flex items-center gap-1 text-rose-500 font-semibold text-sm hover:text-rose-700"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Loading State */}
          {productsLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-2xl animate-pulse"
                  style={{ paddingBottom: "120%" }}
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {productsError && !productsLoading && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900">
                  Failed to load products
                </p>
                <p className="text-sm text-red-700">{productsError}</p>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!productsLoading && !productsError && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.length > 0 ? (
                newArrivals.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-8">
                  No products available
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── Promo Banner ─── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 p-10 sm:p-16 text-white"
        >
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute -right-8 -bottom-20 w-80 h-80 bg-white/5 rounded-full" />
          <div className="relative z-10 max-w-lg">
            <p className="text-rose-200 font-semibold mb-2 uppercase tracking-widest text-sm">
              Limited Time Offer
            </p>
            <h2 className="text-4xl font-black mb-4">
              Get Up To 50% OFF on Selected Items
            </h2>
            <p className="text-rose-100 mb-8">
              Exclusive discounts on premium fashion brands. Shop now and save
              big on your favourite styles!
            </p>
            <Link
              to="/offers"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rose-600 rounded-2xl font-bold hover:bg-rose-50 transition-all shadow-lg"
            >
              Explore Offers <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── Featured Products ─── */}
      <section className="bg-gray-50 py-16" ref={shopRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-rose-500 text-sm font-semibold uppercase tracking-widest mb-1">
                Top Picks
              </p>
              <h2 className="text-3xl font-black text-gray-900">
                Featured Products
              </h2>
            </div>
            <Link
              to="/shop"
              className="flex items-center gap-1 text-rose-500 font-semibold text-sm hover:text-rose-700"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Loading State */}
          {productsLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-gray-300 rounded-2xl animate-pulse"
                  style={{ paddingBottom: "120%" }}
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {productsError && !productsLoading && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900">
                  Failed to load products
                </p>
                <p className="text-sm text-red-700">{productsError}</p>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!productsLoading && !productsError && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featured.length > 0 ? (
                featured.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-8">
                  No products available
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-rose-500 text-sm font-semibold uppercase tracking-widest mb-2">
              Customer Love
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {t.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Newsletter ─── */}
      <section className="bg-gray-900 py-14">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-3">
            Stay in the Loop
          </h2>
          <p className="text-gray-400 mb-8">
            Subscribe to get exclusive deals, new arrivals, and fashion
            inspiration.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector("input");
              if (input) {
                import("sonner").then(({ toast }) => {
                  toast.success("Subscribed successfully! 🎉");
                  input.value = "";
                });
              }
            }}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-3.5 bg-gray-800 text-white rounded-xl border border-gray-700 placeholder-gray-500 outline-none focus:border-rose-500 transition-colors"
            />
            <button
              type="submit"
              className="px-7 py-3.5 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-all shadow-lg whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
