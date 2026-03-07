import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { api, readApiError } from "../services/api";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }

    setCartLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data?.items ? data : { items: [] });
    } catch {
      setCart({ items: [] });
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, size, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, message: "Please login to add products to cart." };
    }

    try {
      const { data } = await api.post("/cart/items", { productId, size, quantity });
      setCart(data?.items ? data : { items: [] });
      return { success: true, message: "Added to cart." };
    } catch (error) {
      return { success: false, message: readApiError(error, "Unable to add item.") };
    }
  };

  const updateCartItem = async (itemId, payload) => {
    try {
      const { data } = await api.patch(`/cart/items/${itemId}`, payload);
      setCart(data?.items ? data : { items: [] });
      return { success: true };
    } catch (error) {
      return { success: false, message: readApiError(error, "Unable to update item.") };
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/items/${itemId}`);
      setCart(data?.items ? data : { items: [] });
      return { success: true };
    } catch (error) {
      return { success: false, message: readApiError(error, "Unable to remove item.") };
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }

    try {
      await api.delete("/cart");
    } catch {
      // Ignore and clear local state.
    } finally {
      setCart({ items: [] });
    }
  };

  const cartCount = useMemo(
    () => cart.items?.reduce((total, item) => total + Number(item.quantity || 0), 0) || 0,
    [cart]
  );

  const value = {
    cart,
    cartCount,
    cartLoading,
    refreshCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
