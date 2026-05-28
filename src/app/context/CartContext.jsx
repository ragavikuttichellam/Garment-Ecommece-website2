import React, { createContext, useContext, useReducer, useEffect } from "react";

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

function calculateTotals(items) {
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  };
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, size, color } = action.payload;
      const existing = state.items.find(
        (i) =>
          i.product.id === product.id &&
          i.selectedSize === size &&
          i.selectedColor === color
      );

      const items = existing
        ? state.items.map((i) =>
            i.product.id === product.id &&
            i.selectedSize === size &&
            i.selectedColor === color
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [
            ...state.items,
            {
              product,
              quantity: 1,
              selectedSize: size,
              selectedColor: color,
            },
          ];

      return { items, ...calculateTotals(items) };
    }
    case "REMOVE_FROM_CART": {
      const items = state.items.filter((i) => i.product.id !== action.payload);
      return { items, ...calculateTotals(items) };
    }
    case "UPDATE_QUANTITY": {
      const items = state.items
        .map((i) =>
          i.product.id === action.payload.productId
            ? { ...i, quantity: action.payload.quantity }
            : i
        )
        .filter((i) => i.quantity > 0);
      return { items, ...calculateTotals(items) };
    }
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    try {
      const stored = localStorage.getItem("garmentx_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...initialState, items: parsed, ...calculateTotals(parsed) };
      }
    } catch {}
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem("garmentx_cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, size, color) => {
    dispatch({ type: "ADD_TO_CART", payload: { product, size, color } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

