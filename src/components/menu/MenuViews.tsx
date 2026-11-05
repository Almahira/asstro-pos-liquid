import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore, type MenuItem } from "../../store/useAppStore";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  Receipt,
  QrCode,
} from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { GlassIconButton } from "../glass/GlassIconButton";
import { GlassInput } from "../glass/GlassInput";
import { GlassPanel } from "../glass/GlassPanel";

// --- 1. CATALOG VIEW ---
export const CatalogView: React.FC = () => {
  const menus = useAppStore((state) => state.menus);
  const addToCart = useAppStore((state) => state.addToCart);
  const searchQuery = useAppStore((state) => state.searchQuery);

  const filteredMenus = [...menus]
    .sort((a, b) => b.rating - a.rating)
    .filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const makanan = filteredMenus.filter((m) => m.category === "MAKANAN");
  const minuman = filteredMenus.filter((m) => m.category === "MINUMAN");

  const renderGrid = (items: MenuItem[]) => (
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 mb-8 sm:px-4">
      {items.map((menu) => (
        <GlassCard
          key={menu.id}
          onClick={() => addToCart(menu)}
          className="min-h-27.5"
        >
          <div className="text-3xl mb-2 drop-shadow-md">{menu.image}</div>
          <p className="text-xs sm:text-sm font-bold text-center leading-tight line-clamp-2 h-8 sm:h-10">
            {menu.name}
          </p>
          <p
            className="text-[10px] sm:text-xs font-bold mt-1"
            style={{ color: "inherit", opacity: 0.85 }}
          >
            Rp {menu.price / 1000}k
          </p>
        </GlassCard>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="h-full overflow-y-auto p-4 pb-24"
    >
      <h2 className="text-sm font-bold mb-3 opacity-80">
        MAKANAN (Bintang Tertinggi)
      </h2>
      {renderGrid(makanan)}

      <h2 className="text-sm font-bold mb-3 opacity-80">
        MINUMAN (Bintang Tertinggi)
      </h2>
      {renderGrid(minuman)}
    </motion.div>
  );
};

// --- 2. CART VIEW ---
export const CartView: React.FC = () => {
  const { cart, updateQty, updateNote, checkout, setActiveView } =
    useAppStore();

  if (cart.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
        <p className="opacity-60 text-sm">Keranjang Kosong</p>
        <GlassButton
          variant="secondary"
          onClick={() => setActiveView("catalog")}
          className="max-w-55"
        >
          Kembali ke Menu
        </GlassButton>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full overflow-y-auto p-4 pb-32 flex flex-col gap-4"
    >
      {cart.map((item) => (
        <GlassCard key={item.id} className="items-stretch! p-4!">
          <div className="flex justify-between items-center mb-3">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{item.menu.name}</p>
              <p className="text-xs opacity-85 mt-0.5">
                Rp {(item.menu.price * item.qty).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-3">
              <GlassIconButton
                size={32}
                onClick={() => updateQty(item.id, -1)}
                ariaLabel="Kurangi"
              >
                <Minus size={14} />
              </GlassIconButton>
              <span className="font-bold text-sm min-w-6 text-center">
                {item.qty}
              </span>
              <GlassIconButton
                size={32}
                onClick={() => updateQty(item.id, 1)}
                ariaLabel="Tambah"
              >
                <Plus size={14} />
              </GlassIconButton>
            </div>
          </div>
          <GlassInput
            value={item.note}
            onChange={(v) => updateNote(item.id, v)}
            placeholder="Catatan (Cth: tanpa gula, pedas)"
          />
        </GlassCard>
      ))}

      <GlassButton variant="primary" tier="hero" onClick={checkout}>
        Proses Pesanan Sekarang
      </GlassButton>
    </motion.div>
  );
};

// --- 3. WAITING VIEW ---
export const WaitingView: React.FC = () => {
  const { orderInfo, cart, orderStatus, simulateCooking, setActiveView } =
    useAppStore();
  const [, setTicker] = useState(0);

  useEffect(() => {
    simulateCooking();
    const interval = setInterval(() => setTicker((t) => t + 1), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allReady =
    orderStatus.length > 0 && orderStatus.every((st) => st.status === "ready");

  const formatTime = (start: number) => {
    const diff = Math.floor((Date.now() - start) / 1000);
    const m = Math.floor(diff / 60)
      .toString()
      .padStart(2, "0");
    const s = (diff % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full overflow-y-auto p-4 pb-8 flex flex-col gap-4"
    >
      <GlassPanel className="p-4 rounded-2xl text-center">
        <p className="text-xs opacity-70">Pesanan Meja Nomor</p>
        <p className="text-2xl font-bold">{orderInfo?.tableNumber}</p>
        <p className="text-sm mt-1 opacity-80">A.N {orderInfo?.customerName}</p>
      </GlassPanel>

      <div className="flex flex-col gap-3">
        {cart.map((item) => {
          const status = orderStatus.find((st) => st.cartItemId === item.id);
          const isReady = status?.status === "ready";
          return (
            <GlassCard key={item.id} className="items-stretch! p-3!">
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">
                    {item.qty}x {item.menu.name}
                  </p>
                  {item.note && (
                    <p className="text-[10px] opacity-85 mt-0.5">
                      Catatan: {item.note}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end ml-2 shrink-0">
                  {isReady ? (
                    <span
                      className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/20 px-2 py-1 rounded-md"
                      style={{ textShadow: "none" }}
                    >
                      <CheckCircle2 size={12} /> READY
                    </span>
                  ) : (
                    <span
                      className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-500/20 px-2 py-1 rounded-md mb-1"
                      style={{ textShadow: "none" }}
                    >
                      <Clock size={12} /> DIMASAK
                    </span>
                  )}
                  {!isReady && status && (
                    <span className="text-[10px] font-mono opacity-70">
                      {formatTime(status.startTime)}
                    </span>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {allReady && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <GlassButton
            variant="primary"
            tier="hero"
            onClick={() => setActiveView("invoice")}
          >
            <Receipt size={18} /> LIHAT INVOICE (KE KASIR)
          </GlassButton>
        </motion.div>
      )}
    </motion.div>
  );
};

// --- 4. INVOICE VIEW ---
export const InvoiceView: React.FC = () => {
  const { orderInfo, cart, resetOrder } = useAppStore();
  const navigate = useNavigate();

  // ⭐ FIX: orderId hanya di-generate sekali saat mount,
  // tidak berubah setiap re-render (bug lama di file original).
  const orderId = useMemo(
    () => `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    [],
  );

  const totalPrice = cart.reduce(
    (acc, curr) => acc + curr.menu.price * curr.qty,
    0,
  );

  const handleFinish = () => {
    resetOrder();
    navigate("/", { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full overflow-y-auto p-6 flex flex-col items-center justify-center gap-6"
    >
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold">Pesanan Selesai!</h2>
        <p className="text-sm mt-1 opacity-70">Tunjukkan QR ini ke Kasir</p>
      </div>

      {/* QR Card — HERO tier, ini "wow moment"-nya */}
      <GlassPanel
        tier="hero"
        className="p-6 rounded-3xl flex flex-col items-center justify-center"
      >
        <div
          className="p-4 rounded-2xl bg-white text-black"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
        >
          <QrCode size={120} strokeWidth={1.5} />
        </div>
        <p className="mt-4 font-mono font-bold tracking-widest">{orderId}</p>
        <p className="text-xs mt-1 opacity-70">
          Meja {orderInfo?.tableNumber} - {orderInfo?.customerName}
        </p>
      </GlassPanel>

      {/* Total panel */}
      <GlassPanel className="w-full max-w-62.5 px-4 py-3 rounded-2xl flex justify-between items-center">
        <span className="text-sm font-bold opacity-85">Grand Total</span>
        <span className="text-xl font-bold">
          Rp {totalPrice.toLocaleString()}
        </span>
      </GlassPanel>

      <GlassButton
        variant="primary"
        tier="hero"
        onClick={handleFinish}
        className="w-full max-w-62.5"
      >
        Selesai & Tutup Sesi
      </GlassButton>
    </motion.div>
  );
};
