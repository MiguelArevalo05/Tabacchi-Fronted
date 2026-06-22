"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Cart } from "@/types/ecommerce";
import { CartItemType } from "@/types/ecommerce";
import * as cartService from "@/services/cartService";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  addServiceToCart: (serviceId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
}

const emptyCart: Cart = {
  id: "",
  userId: "",
  items: [],
  total: 0,
  itemCount: 0,
  createdAt: "",
  updatedAt: "",
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      setCart(emptyCart);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      const data = await cartService.addCartItem({
        itemType: CartItemType.PRODUCT,
        productId,
        quantity,
      });
      setCart(data);
      return true;
    } catch {
      return false;
    }
  };

  const addServiceToCart = async (serviceId: string, quantity = 1) => {
    try {
      const data = await cartService.addCartItem({
        itemType: CartItemType.SERVICE,
        serviceId,
        quantity,
      });
      setCart(data);
      return true;
    } catch {
      return false;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const data = await cartService.updateCartItem(itemId, { quantity });
      setCart(data);
      return true;
    } catch {
      return false;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const data = await cartService.removeCartItem(itemId);
      setCart(data);
      return true;
    } catch {
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const data = await cartService.clearCart();
      setCart(data);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        refreshCart,
        addToCart,
        addServiceToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
