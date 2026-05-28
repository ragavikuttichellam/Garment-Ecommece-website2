import React from "react";
import { Link } from "react-router";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";

export function Orders() {
  const { orders } = useOrders();
  const { user, isAuthenticated } = useAuth();

  const userOrders = orders.filter((o) => o.userId === user?.id);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex flex-col items-center justify-center text-center px-6">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
        <p className="text-gray-500 mb-6">Login to view your orders</p>
        <Link to="/login" className="px-6 py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-all">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-black text-gray-900 mb-8">My Orders</h1>

        {userOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Your placed orders will appear here.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Order Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Order ID</p>
                    <p className="text-sm font-bold text-gray-900 font-mono">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                      order.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                      order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                      order.status === "processing" ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-5">
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-16 object-cover rounded-xl flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} | Size: {item.selectedSize}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                          ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="text-base font-black text-gray-900">₹{order.grandTotal.toLocaleString("en-IN")}</p>
                    </div>
                    <Link
                      to={`/order-success/${order.id}`}
                      className="flex items-center gap-1 text-rose-500 text-sm font-semibold hover:text-rose-700"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

