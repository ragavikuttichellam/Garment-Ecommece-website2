import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Search,
  AlertCircle,
} from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../../hooks/useProducts";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest First" },
];

const CATEGORIES = ["all", "men", "women", "kids"];
const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1000", min: 500, max: 1000 },
  { label: "₹1000 – ₹2500", min: 1000, max: 2500 },
  { label: "₹2500 – ₹5000", min: 2500, max: 5000 },
  { label: "Above ₹5000", min: 5000, max: Infinity },
];

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    priceRange: null,
    onlyNew: false,
    onlyOffers: false,
    sort: "featured",
  });

  // Fetch products from API
  const { products: apiProducts, loading, error } = useProducts(1, searchInput);

  useEffect(() => {
    const searchVal = searchParams.get("search") || "";
    const catVal = searchParams.get("category") || "all";
    setSearchInput(searchVal);
    setFilters((prev) => ({ ...prev, category: catVal }));
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...apiProducts];

    // Search
    if (searchInput.trim()) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          p.description.toLowerCase().includes(searchInput.toLowerCase()),
      );
    }

    // Category
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Price range
    if (filters.priceRange) {
      result = result.filter(
        (p) =>
          p.price >= filters.priceRange.min &&
          p.price <= filters.priceRange.max,
      );
    }

    // Sort
    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [filters, searchInput, apiProducts]);

  const clearFilters = () => {
    setFilters({
      category: "all",
      priceRange: null,
      onlyNew: false,
      onlyOffers: false,
      sort: "featured",
    });
    setSearchInput("");
    setSearchParams({});
  };

  const activeFilterCount =
    (filters.category !== "all" ? 1 : 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.onlyNew ? 1 : 0) +
    (filters.onlyOffers ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-black text-gray-900 mb-1">
            All Products
          </h1>
          <p className="text-gray-500 text-sm">
            {filteredProducts.length} products found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-rose-400 transition-colors"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sort: e.target.value }))
              }
              className="appearance-none pl-4 pr-10 py-3 bg-white rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-rose-400 cursor-pointer min-w-44"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-rose-400 transition-colors relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`${
              filtersOpen ? "block" : "hidden"
            } lg:block w-full lg:w-64 flex-shrink-0`}
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-900">Filters</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-rose-500 font-medium flex items-center gap-1 hover:text-rose-700"
                  >
                    <X className="w-3 h-3" />
                    Clear All
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Category
                </h4>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat}
                        onChange={() =>
                          setFilters((prev) => ({ ...prev, category: cat }))
                        }
                        className="w-4 h-4 accent-rose-500"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-rose-600 transition-colors capitalize">
                        {cat === "all"
                          ? "All Categories"
                          : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Price Range
                </h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <label
                      key={range.label}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="price"
                        checked={
                          filters.priceRange?.min === range.min &&
                          filters.priceRange?.max === range.max
                        }
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange:
                              prev.priceRange?.min === range.min
                                ? null
                                : { min: range.min, max: range.max },
                          }))
                        }
                        className="w-4 h-4 accent-rose-500"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-rose-600 transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Quick Filters
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.onlyNew}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          onlyNew: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 accent-rose-500 rounded"
                    />
                    <span className="text-sm text-gray-600">
                      New Arrivals Only
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.onlyOffers}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          onlyOffers: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 accent-rose-500 rounded"
                    />
                    <span className="text-sm text-gray-600">On Sale</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">
                    Failed to load products
                  </p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Try adjusting your filters or search query
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-all"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
