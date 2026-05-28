import { useState, useEffect } from "react";
import { productAPI } from "../services/api";

const FALLBACK_IMAGE =
  "https://placehold.co/400x500/f3f4f6/9ca3af?text=No+Image";

export function resolveImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.secure_url || image.url || image.path || image.src || "";
}

export function normalizeProduct(product) {
  const rawImages = Array.isArray(product.images) ? product.images : [];
  const images = [
    resolveImageUrl(product.image),
    ...rawImages.map(resolveImageUrl),
  ].filter((url, index, arr) => url && arr.indexOf(url) === index);

  const price = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice) || price;

  return {
    ...product,
    id: product.id || product._id,
    image: images[0] || FALLBACK_IMAGE,
    images: images.length ? images : [FALLBACK_IMAGE],
    price,
    originalPrice,
    stock: Number(product.stock) || 0,
    rating: Number(product.rating) || 0,
    reviews: Number(product.reviews) || 0,
    discount: Number(product.discount) || 0,
    brand: product.brand || "GarmentX",
    category: (product.category || "").toLowerCase(),
    description: product.description || "",
    sizes: Array.isArray(product.sizes) && product.sizes.length ? product.sizes : ["M"],
    colors:
      Array.isArray(product.colors) && product.colors.length
        ? product.colors
        : ["Default"],
    isNew: Boolean(product.isNew),
    isOffer: Boolean(product.isOffer || Number(product.discount) > 0),
  };
}

function getProductsFromResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.products)) return data.data.products;
  return null;
}

/**
 * Custom hook to fetch products from API
 * @param {number} page - Page number for pagination
 * @param {string} keyword - Search keyword
 * @returns {object} { products, loading, error, page, pages }
 */
export function useProducts(page = 1, keyword = "") {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageData, setPageData] = useState({ page: 1, pages: 1 });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await productAPI.getProducts(page, keyword);

        const responseProducts = getProductsFromResponse(response.data);

        if (!responseProducts) {
          throw new Error("Invalid API response structure");
        }

        setProducts(responseProducts.map(normalizeProduct));
        setPageData({
          page: response.data?.page || page,
          pages: response.data?.pages || 1,
        });
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load products",
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, keyword]);

  return { products, loading, error, ...pageData };
}

/**
 * Custom hook to fetch a single product by ID
 * @param {string} id - Product ID
 * @returns {object} { product, loading, error }
 */
export function useProductById(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await productAPI.getProductById(id);

        setProduct(normalizeProduct(response.data));
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load product",
        );
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}
