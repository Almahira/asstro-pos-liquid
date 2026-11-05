import { create } from "zustand";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "MAKANAN" | "MINUMAN";
  rating: number; // Untuk sorting "Sering Terjual"
}

export interface CartItem {
  id: string;
  menu: MenuItem;
  qty: number;
  note: string;
}

export interface OrderItemStatus {
  cartItemId: string;
  status: "dimasak" | "ready";
  startTime: number;
}

interface AppState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  orderInfo: { customerName: string; tableNumber: string } | null;
  setOrderInfo: (name: string, table: string) => void;
  liquidPhysics: { isHovered: boolean; isPressed: boolean };
  setLiquidPhysics: (
    physics: Partial<{ isHovered: boolean; isPressed: boolean }>,
  ) => void;

  // Data Menu Mock (Bisa diganti fetch API nanti)
  menus: MenuItem[];

  // Pencarian Menu
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Keranjang
  cart: CartItem[];
  addToCart: (menu: MenuItem) => void;
  updateQty: (id: string, delta: number) => void;
  updateNote: (id: string, note: string) => void;

  // Status Halaman & Pesanan
  activeView: "catalog" | "cart" | "waiting" | "invoice";
  setActiveView: (view: "catalog" | "cart" | "waiting" | "invoice") => void;
  orderStatus: OrderItemStatus[];
  checkout: () => void;
  simulateCooking: () => void;
  resetOrder: () => void;
}

const MOCK_MENUS: MenuItem[] = [
  {
    id: "m1",
    name: "Ayam Bakar",
    price: 25000,
    category: "MAKANAN",
    rating: 4.9,
    image: "🍗",
  },
  {
    id: "m2",
    name: "Nasi Goreng",
    price: 20000,
    category: "MAKANAN",
    rating: 4.8,
    image: "🍛",
  },
  {
    id: "m3",
    name: "Sate Maranggi",
    price: 30000,
    category: "MAKANAN",
    rating: 5.0,
    image: "🍢",
  },
  {
    id: "m4",
    name: "Gurame Asam",
    price: 45000,
    category: "MAKANAN",
    rating: 4.7,
    image: "🐟",
  },
  {
    id: "m5",
    name: "Mie Tek-Tek",
    price: 18000,
    category: "MAKANAN",
    rating: 4.5,
    image: "🍜",
  },
  {
    id: "m6",
    name: "Bebek Goreng",
    price: 35000,
    category: "MAKANAN",
    rating: 4.6,
    image: "🦆",
  },

  {
    id: "d1",
    name: "Jus Mangga",
    price: 12000,
    category: "MINUMAN",
    rating: 4.9,
    image: "🥭",
  },
  {
    id: "d2",
    name: "Jus Stroberi",
    price: 10000,
    category: "MINUMAN",
    rating: 4.7,
    image: "🍓",
  },
  {
    id: "d3",
    name: "Es Teh Manis",
    price: 5000,
    category: "MINUMAN",
    rating: 5.0,
    image: "🍹",
  },
  {
    id: "d4",
    name: "Kopi Susu",
    price: 15000,
    category: "MINUMAN",
    rating: 4.8,
    image: "☕",
  },
  {
    id: "d5",
    name: "Es Jeruk",
    price: 8000,
    category: "MINUMAN",
    rating: 4.6,
    image: "🍊",
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  theme: "dark",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  orderInfo: null,
  setOrderInfo: (name, table) =>
    set({ orderInfo: { customerName: name, tableNumber: table } }),
  liquidPhysics: { isHovered: false, isPressed: false },
  setLiquidPhysics: (physics) =>
    set((state) => ({ liquidPhysics: { ...state.liquidPhysics, ...physics } })),

  menus: MOCK_MENUS,

  // === Fitur Pencarian ===
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  cart: [],

  addToCart: (menu) =>
    set((state) => {
      const existing = state.cart.find((item) => item.menu.id === menu.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.menu.id === menu.id ? { ...item, qty: item.qty + 1 } : item,
          ),
        };
      }
      return {
        cart: [
          ...state.cart,
          { id: Math.random().toString(), menu, qty: 1, note: "" },
        ],
      };
    }),

  updateQty: (id, delta) =>
    set((state) => ({
      cart: state.cart
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(0, item.qty + delta);
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0),
    })),

  updateNote: (id, note) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, note } : item,
      ),
    })),

  activeView: "catalog",
  setActiveView: (view) => set({ activeView: view }),

  orderStatus: [],
  checkout: () =>
    set((state) => {
      const status: OrderItemStatus[] = state.cart.map((item) => ({
        cartItemId: item.id,
        status: "dimasak",
        startTime: Date.now(),
      }));
      return { orderStatus: status, activeView: "waiting" };
    }),

  // Simulasi WebSocket/Backend: Mengubah status 'dimasak' menjadi 'ready' secara acak
  simulateCooking: () => {
    const { orderStatus } = get();
    orderStatus.forEach((item, index) => {
      setTimeout(
        () => {
          set((state) => ({
            orderStatus: state.orderStatus.map((st) =>
              st.cartItemId === item.cartItemId
                ? { ...st, status: "ready" }
                : st,
            ),
          }));
        },
        5000 + index * 3000,
      );
    });
  },

  resetOrder: () =>
    set({
      orderInfo: null,
      cart: [],
      orderStatus: [],
      activeView: "catalog",
    }),
}));
