import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ShoppingBag, Star, Heart, Zap, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle both single image and images array from backend
  const productImage =
    product.image ||
    product.images?.[0] ||
    "https://placehold.co/400x500/f3f4f6/9ca3af?text=No+Image";
  const price = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice) || price;

  // Handle missing sizes/colors
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const firstSize = sizes[0] || "M";
  const firstColor = colors[0] || "Default";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, firstSize, firstColor);
    toast.success(`${product.name} added to cart!`, {
      description: `Size: ${firstSize} | Color: ${firstColor}`,
      duration: 2000,
    });
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product, firstSize, firstColor);
    navigate("/cart");
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist!", {
      icon: isWishlisted ? "💔" : "❤️",
    });
  };

  const renderStars = (rating) => {
    const rate = Math.min(Math.max(rating || 0, 0), 5);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rate) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-rose-100"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Container */}
      <div
        className="relative overflow-hidden bg-gray-50"
        style={{ paddingBottom: "120%" }}
      >
        <img
          src={
            imageError
              ? "https://placehold.co/400x500/f3f4f6/9ca3af?text=No+Image"
              : productImage
          }
          alt={product.name}
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
              NEW
            </span>
          )}
          {product.discount > 0 && (
            <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "text-rose-500 fill-rose-500" : "text-gray-400"
            }`}
          />
        </button>

        {/* Quick View */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-sm hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 whitespace-nowrap"
        >
          <Eye className="w-3.5 h-3.5" />
          Quick View
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-rose-500 font-medium mb-1 uppercase tracking-wide">
          {product.brand}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 mb-1.5 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="flex items-center gap-0.5">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-black text-gray-900">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {originalPrice > price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1.5 py-2.5 border border-rose-300 text-rose-600 rounded-xl text-xs font-semibold hover:bg-rose-50 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-1.5 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 transition-all shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
