"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/lib/culture";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  note?: string;
}
interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  total: number;
}
const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = "viet-culture-preview-cart";
const clampQuantity = (quantity: number) =>
  Math.max(1, Math.min(99, Math.floor(quantity) || 1));

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]",
      );
      if (Array.isArray(saved)) {
        // Restore only known catalogue items, using current catalogue prices.
        const restored: CartItem[] = [];
        for (const value of saved) {
          if (
            !value ||
            typeof value !== "object" ||
            typeof value.id !== "string" ||
            typeof value.quantity !== "number" ||
            !Number.isFinite(value.quantity)
          )
            continue;
          const product = products.find((product) => product.id === value.id);
          if (product && !restored.some((item) => item.id === product.id))
            restored.push({
              ...product,
              quantity: clampQuantity(value.quantity),
            });
        }
        setItems(restored);
      }
    } catch {
      // Storage may be unavailable; the in-memory bag remains usable.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items.map(({ id, quantity }) => ({ id, quantity }))),
      );
    } catch {
      // Keeping items in memory is sufficient for the preview.
    }
  }, [items, hydrated]);

  const addToCart = (newItem: CartItem) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === newItem.id);
      return existing
        ? current.map((item) =>
            item.id === newItem.id
              ? {
                  ...item,
                  quantity: clampQuantity(item.quantity + newItem.quantity),
                }
              : item,
          )
        : [
            ...current,
            { ...newItem, quantity: clampQuantity(newItem.quantity) },
          ];
    });
  };
  const removeFromCart = (id: string) =>
    setItems((current) => current.filter((item) => item.id !== id));
  const updateQuantity = (id: string, quantity: number) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: clampQuantity(quantity) } : item,
      ),
    );
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
