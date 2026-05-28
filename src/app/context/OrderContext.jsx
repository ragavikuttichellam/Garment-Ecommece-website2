import React, { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext(undefined);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem("garmentx_orders");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("garmentx_orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData) => {
    const order = {
      ...orderData,
      id: `o${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const getOrderById = (id) => orders.find((o) => o.id === id);

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
}

