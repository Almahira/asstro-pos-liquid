import React from "react";
import { Navigate } from "react-router-dom";
import { Filter, ShoppingCart, ChevronLeft } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import {
  CatalogView,
  CartView,
  WaitingView,
  InvoiceView,
} from "../components/menu/MenuViews";
import { GlassSearchBar } from "../components/glass/GlassSearchBar";
import { GlassIconButton } from "../components/glass/GlassIconButton";
import { GlassPanel } from "../components/glass/GlassPanel";
import { getGlassThemeStyles } from "../three/glassThemeStyles";

const MenuPage: React.FC = () => {
  const {
    theme,
    orderInfo,
    cart,
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    toggleTheme,
  } = useAppStore();

  const isDark = theme === "dark";
  const t = getGlassThemeStyles(theme);

  if (!orderInfo) {
    return <Navigate to="/" replace />;
  }

  const totalItem = cart.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPrice = cart.reduce(
    (acc, curr) => acc + curr.menu.price * curr.qty,
    0,
  );

  const showHeader = activeView !== "invoice";
  const showFooter = activeView !== "waiting" && activeView !== "invoice";

  return (
    <div
      className={`relative flex flex-col w-full h-full overflow-hidden ${isDark ? "text-white" : "text-black"}`}
    >
      {/* HEADER — transparan, semua elemen glass melayang di atas Canvas */}
      {showHeader && (
        <header className="flex items-center justify-between gap-3 p-3 sm:p-4 z-20">
          {activeView === "catalog" ? (
            <>
              <GlassSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Cari makanan..."
                className="flex-1 max-w-md mr-2"
              />

              <div className="flex items-center gap-2 sm:gap-3">
                <GlassIconButton onClick={toggleTheme} ariaLabel="Toggle tema">
                  <span className="text-base">
                    {theme === "dark" ? "☀️" : "🌙"}
                  </span>
                </GlassIconButton>

                <GlassIconButton ariaLabel="Filter">
                  <Filter size={18} />
                </GlassIconButton>

                <GlassIconButton
                  onClick={() => setActiveView("cart")}
                  ariaLabel="Keranjang"
                  badge={totalItem}
                >
                  <ShoppingCart size={18} />
                </GlassIconButton>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <GlassIconButton
                onClick={() => setActiveView("catalog")}
                ariaLabel="Kembali"
              >
                <ChevronLeft size={18} />
              </GlassIconButton>
              <h1 className="font-bold text-base" style={t.text}>
                {activeView === "cart" ? "Keranjang" : "Status Pesanan"}
              </h1>
            </div>
          )}
        </header>
      )}

      {/* KONTEN UTAMA */}
      <main className="flex-1 relative overflow-hidden bg-transparent">
        <AnimatePresence mode="wait">
          {activeView === "catalog" && <CatalogView key="catalog" />}
          {activeView === "cart" && <CartView key="cart" />}
          {activeView === "waiting" && <WaitingView key="waiting" />}
          {activeView === "invoice" && <InvoiceView key="invoice" />}
        </AnimatePresence>
      </main>

      {/* FOOTER — floating glass panel */}
      {showFooter && (
        <footer className="absolute bottom-0 left-0 w-full p-3 sm:p-4 z-20 pointer-events-none">
          <GlassPanel className="max-w-7xl mx-auto px-5 py-4 pointer-events-auto rounded-2xl">
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-70">
                  Subtotal ({totalItem} Item)
                </span>
                <span
                  className="text-lg sm:text-xl font-bold"
                  style={{
                    ...t.text,
                    color: t.accentColor,
                  }}
                >
                  Rp {totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-70">
                  Meja Anda
                </span>
                <span className="font-bold text-base sm:text-lg">
                  {orderInfo.tableNumber}
                </span>
              </div>
            </div>
          </GlassPanel>
        </footer>
      )}
    </div>
  );
};

export default MenuPage;
