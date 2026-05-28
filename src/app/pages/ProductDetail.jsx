import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  ShoppingBag,
  Star,
  Heart,
  Zap,
  Truck,
  RefreshCw,
  Shield,
  Share2,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { ProductCard } from "../components/ProductCard";
import { toast } from "sonner";
import { useProductById, useProducts } from "../../hooks/useProducts";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { product, loading, error } = useProductById(id);
  const { products } = useProducts(1, "");

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || "");
      setSelectedColor(product.colors?.[0] || "");
      setQuantity(1);
      setActiveImage(0);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="h-96 sm:h-[520px] bg-gray-200 rounded-3xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded-xl animate-pulse w-2/3" />
            <div className="h-5 bg-gray-200 rounded-xl animate-pulse w-1/3" />
            <div className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center text-center px-6">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">{error || "The product you're looking for doesn't exist."}</p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-all"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const price = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice) || price;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
    }
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    addToCart(product, selectedSize, selectedColor);
    navigate("/cart");
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
      />
    ));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-rose-500 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-rose-500 transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/${product.category}`} className="hover:text-rose-500 transition-colors capitalize">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800 truncate max-w-32">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ── Images ── */}
          <div>
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm mb-4">
              <img
                src={product.images?.[activeImage] || product.image}
                alt={product.name}
                className="w-full h-96 sm:h-[520px] object-cover"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">NEW</span>
                )}
                {product.discount > 0 && (
                  <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "text-rose-500 fill-rose-500" : "text-gray-400"}`} />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? "border-rose-500" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div>
            <p className="text-rose-500 font-semibold text-sm mb-1">{product.brand}</p>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0.5">{renderStars(product.rating)}</div>
              <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-black text-gray-900">
                ₹{price.toLocaleString("en-IN")}
              </span>
              {originalPrice > price && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-emerald-600 font-bold text-sm">
                    Save ₹{(originalPrice - price).toLocaleString("en-IN")}
                  </span>
                </>
              )}
            </div>

            {/* Sizes */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Select Size</h3>
                <button className="text-xs text-rose-500 hover:text-rose-700">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      selectedSize === size
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-200 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Color: <span className="font-normal text-gray-500">{selectedColor}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedColor === color
                        ? "bg-rose-50 text-rose-700 border-rose-400"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="w-12 text-center text-base font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="text-xs text-gray-500">{product.stock} in stock</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-rose-500 text-rose-600 rounded-2xl font-bold hover:bg-rose-50 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30"
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
                className="w-14 border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mb-6">
              {[
                { icon: Truck, text: "Free delivery on orders above ₹999" },
                { icon: RefreshCw, text: "Easy 30-day return & exchange" },
                { icon: Shield, text: "100% authentic products" },
              ].map(({ icon: Icon, text }, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Product Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-black text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
