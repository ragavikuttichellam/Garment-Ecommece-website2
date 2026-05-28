import React from "react";
import { RouterProvider } from "react-router";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { router } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <RouterProvider router={router} />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

