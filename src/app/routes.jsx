import React from "react";
import { createBrowserRouter, Outlet } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { CategoryPage } from "./pages/CategoryPage";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrderSuccess } from "./pages/OrderSuccess";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Admin } from "./pages/Admin";
import { Contact } from "./pages/Contact";
import { NewArrivals } from "./pages/NewArrivals";
import { Offers } from "./pages/Offers";
import { Orders } from "./pages/Orders";
import { Toaster } from "sonner";

function Root() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontFamily: "inherit",
          },
        }}
        richColors
      />
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 flex flex-col items-center justify-center text-center px-6">
      <div className="text-8xl mb-6">🛍️</div>
      <h1 className="text-4xl font-black text-gray-900 mb-3">404 – Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        Oops! The page you're looking for doesn't exist. Let's get you back to shopping!
      </p>
      <a
        href="/"
        className="px-8 py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg"
      >
        Back to Home
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "shop", Component: Shop },
      { path: "men", Component: CategoryPage },
      { path: "women", Component: CategoryPage },
      { path: "kids", Component: CategoryPage },
      { path: "new-arrivals", Component: NewArrivals },
      { path: "offers", Component: Offers },
      { path: "contact", Component: Contact },
      { path: "product/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "order-success/:orderId", Component: OrderSuccess },
      { path: "orders", Component: Orders },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "admin", Component: Admin },
      { path: "wishlist", element: (
        <div className="min-h-screen bg-gray-50 pt-28 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Wishlist Coming Soon</h2>
          <p className="text-gray-500">This feature will be available soon!</p>
        </div>
      )},
      { path: "*", Component: NotFound },
    ],
  },
]);

