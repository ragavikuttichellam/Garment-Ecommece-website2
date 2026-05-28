import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  TrendingUp,
  DollarSign,
  Eye,
  X,
  Save,
} from "lucide-react";
import { products as initialProducts } from "../data/products";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { toast } from "sonner";
import { productAPI } from "../../services/api";
import { normalizeProduct } from "../../hooks/useProducts";

const EMPTY_PRODUCT = {
  name: "",
  price: 0,
  originalPrice: 0,
  category: "men",
  subcategory: "",
  image: "",
  images: [],
  rating: 4.0,
  reviews: 0,
  description: "",
  sizes: ["S", "M", "L", "XL"],
  colors: ["Black", "White"],
  stock: 0,
  isNew: false,
  isOffer: false,
  discount: 0,
  brand: "GarmentX",
  tags: [],
};

export function Admin() {
  const { isAdmin, isAuthenticated, token, logout } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_PRODUCT);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productAPI.getProducts(1, "");
        const apiProducts = response.data?.products || [];
        if (apiProducts.length) {
          setProducts(apiProducts.map(normalizeProduct));
        }
      } catch (error) {
        console.error("Admin product load failed:", error.response?.data || error.message);
      }
    };

    loadProducts();
  }, []);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex flex-col items-center justify-center text-center px-6">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-6">You need admin privileges to access this page.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-all"
        >
          Login as Admin
        </button>
      </div>
    );
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const STATS = [
    { icon: TrendingUp, label: "Total Sales", value: `₹${totalRevenue.toLocaleString("en-IN")}`, color: "bg-emerald-50 text-emerald-600" },
    { icon: ShoppingCart, label: "Total Orders", value: totalOrders.toString(), color: "bg-blue-50 text-blue-600" },
    { icon: Package, label: "Total Products", value: totalProducts.toString(), color: "bg-rose-50 text-rose-600" },
    { icon: DollarSign, label: "Avg Order Value", value: totalOrders > 0 ? `₹${(totalRevenue / totalOrders).toLocaleString("en-IN")}` : "₹0", color: "bg-amber-50 text-amber-600" },
  ];

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ ...EMPTY_PRODUCT });
    setImageFile(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    const { id, ...rest } = product;
    setFormData(rest);
    setImageFile(null);
    setModalOpen(true);
  };

  const buildProductFormData = () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("originalPrice", formData.originalPrice || formData.price);
    data.append("category", formData.category);
    data.append("brand", formData.brand || "GarmentX");
    data.append("stock", formData.stock);
    data.append("discount", formData.discount || 0);
    data.append("rating", formData.rating || 0);
    data.append("reviews", formData.reviews || 0);
    data.append("isNew", formData.isNew ? "true" : "false");
    data.append("isOffer", formData.isOffer ? "true" : "false");
    data.append("sizes", JSON.stringify(formData.sizes || []));
    data.append("colors", JSON.stringify(formData.colors || []));
    data.append("tags", JSON.stringify(formData.tags || []));

    if (formData.image) {
      data.append("image", formData.image);
    }

    if (imageFile) {
      data.set("image", imageFile);
    }

    return data;
  };

  const handleSave = async () => {
    if (!token) {
      toast.error("Please login again as a backend admin");
      logout();
      navigate("/login");
      return;
    }

    if (!formData.name || !formData.price) {
      toast.error("Name and price are required");
      return;
    }

    try {
      setSaving(true);
      const data = buildProductFormData();
      const response = editingProduct
        ? await productAPI.updateProduct(editingProduct.id, data)
        : await productAPI.createProduct(data);
      const savedProduct = normalizeProduct(response.data);

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? savedProduct : p))
        );
        toast.success("Product updated successfully!");
      } else {
        setProducts((prev) => [savedProduct, ...prev]);
        toast.success("Product added successfully!");
      }

      setModalOpen(false);
      setImageFile(null);
    } catch (error) {
      console.error("Product save failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Product save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    toast.success("Product deleted");
  };

  const TABS = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "products", icon: Package, label: "Products" },
    { id: "orders", icon: ShoppingCart, label: "Orders" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Manage your GarmentX store</p>
          </div>
          <div className="flex gap-2">
            {TABS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === id
                    ? "bg-rose-500 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-rose-50 border border-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Dashboard ── */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {STATS.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-black text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No orders yet</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                        <th className="text-left px-5 py-3">Order ID</th>
                        <th className="text-left px-5 py-3">Customer</th>
                        <th className="text-left px-5 py-3">Items</th>
                        <th className="text-left px-5 py-3">Total</th>
                        <th className="text-left px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 10).map((order) => (
                        <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{order.id}</td>
                          <td className="px-5 py-3.5 font-medium text-gray-800">{order.address.name}</td>
                          <td className="px-5 py-3.5 text-gray-600">{order.items.length} items</td>
                          <td className="px-5 py-3.5 font-bold text-gray-900">₹{order.grandTotal.toLocaleString("en-IN")}</td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                              order.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                              order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                              order.status === "processing" ? "bg-amber-100 text-amber-700" :
                              "bg-gray-100 text-gray-600"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Products ── */}
        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400"
                />
              </div>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-5 py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-all shadow-lg text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      <th className="text-left px-5 py-3">Product</th>
                      <th className="text-left px-5 py-3 hidden md:table-cell">Category</th>
                      <th className="text-left px-5 py-3">Price</th>
                      <th className="text-left px-5 py-3 hidden sm:table-cell">Stock</th>
                      <th className="text-left px-5 py-3 hidden sm:table-cell">Rating</th>
                      <th className="text-center px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((product) => (
                      <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 text-xs truncate max-w-36">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div>
                            <p className="font-bold text-gray-900">₹{product.price.toLocaleString("en-IN")}</p>
                            <p className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <span className={`text-xs font-semibold ${product.stock < 10 ? "text-red-500" : "text-gray-600"}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <div className="flex items-center gap-1">
                            <span className="text-amber-400">★</span>
                            <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => navigate(`/product/${product.id}`)}
                              className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(product)}
                              className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-amber-100 hover:text-amber-600 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Orders ── */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">All Orders ({orders.length})</h2>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No orders yet. Orders will appear here once placed.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                        <th className="text-left px-5 py-3">Order ID</th>
                        <th className="text-left px-5 py-3">Customer</th>
                        <th className="text-left px-5 py-3 hidden sm:table-cell">Date</th>
                        <th className="text-left px-5 py-3">Amount</th>
                        <th className="text-left px-5 py-3">Payment</th>
                        <th className="text-left px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{order.id}</td>
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-gray-800 text-xs">{order.address.name}</p>
                            <p className="text-xs text-gray-500">{order.address.phone}</p>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-500 hidden sm:table-cell">
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-5 py-3.5 font-bold text-gray-900">
                            ₹{order.grandTotal.toLocaleString("en-IN")}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              order.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                              order.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                              order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                              order.status === "processing" ? "bg-amber-100 text-amber-700" :
                              "bg-gray-100 text-gray-600"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {(
                [
                  ["Product Name", "name", "text"],
                  ["Brand", "brand", "text"],
                  ["Image URL", "image", "text"],
                  ["Description", "description", "text"],
                ]
              ).map(([label, key, type]) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
                  {key === "description" ? (
                    <textarea
                      value={formData[key]}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 resize-none"
                    />
                  ) : (
                    <input
                      type={type}
                      value={formData[key]}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400"
                    />
                  )}
                </div>
              ))}

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400"
                />
                {(imageFile || formData.image) && (
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.image}
                    alt="Product preview"
                    className="mt-3 w-20 h-24 object-cover rounded-lg border border-gray-200"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    ["Price (₹)", "price"],
                    ["Original Price (₹)", "originalPrice"],
                    ["Discount (%)", "discount"],
                    ["Stock", "stock"],
                  ]
                ).map(([label, key]) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
                    <input
                      type="number"
                      value={formData[key]}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Category</label>
                <select
                  value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isNew: e.target.checked }))}
                    className="w-4 h-4 accent-rose-500"
                  />
                  <span className="text-sm text-gray-700">New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isOffer}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isOffer: e.target.checked }))}
                    className="w-4 h-4 accent-rose-500"
                  />
                  <span className="text-sm text-gray-700">On Offer</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
          >
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
