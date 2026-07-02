"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Cart } from "@/features/products/types/ecommerce";
import { CartItemType } from "@/features/products/types/ecommerce";
import * as cartService from "@/features/cart/services/cartService";
import { useAuth } from "@/features/auth/hooks/useAuth";

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

const emptyCartBreakdown = {
  productsSubtotal: 0,
  servicesSubtotal: 0,
  productLineCount: 0,
  serviceLineCount: 0,
  subtotal: 0,
  igv: 0,
  total: 0,
  hasIgv: false,
  hasExcludedIgvProducts: false,
};

const emptyCart: Cart = {
  id: "",
  userId: "",
  items: [],
  total: 0,
  itemCount: 0,
  breakdown: emptyCartBreakdown,
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
    void refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (productId: string, quantity = 1) => {
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
  }, []);

  const addServiceToCart = useCallback(async (serviceId: string, quantity = 1) => {
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
  }, []);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    try {
      const data = await cartService.updateCartItem(itemId, { quantity });
      setCart(data);
      return true;
    } catch {
      return false;
    }
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    try {
      const data = await cartService.removeCartItem(itemId);
      setCart(data);
      return true;
    } catch {
      return false;
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      const data = await cartService.clearCart();
      setCart(data);
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      cart,
      loading,
      refreshCart,
      addToCart,
      addServiceToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      cart,
      loading,
      refreshCart,
      addToCart,
      addServiceToCart,
      updateQuantity,
      removeItem,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
