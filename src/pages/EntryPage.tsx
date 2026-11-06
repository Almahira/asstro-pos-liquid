import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, ArrowRight, UtensilsCrossed, Sun, Moon } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { GlassInput } from "../components/glass/GlassInput";
import { GlassButton } from "../components/glass/GlassButton";
import { GlassIconButton } from "../components/glass/GlassIconButton";

const EntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { setOrderInfo, theme, toggleTheme } = useAppStore();
  const isDark = theme === "dark";

  const [name, setName] = useState("");
  const [table, setTable] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && table.trim()) {
      setOrderInfo(name, table);
      navigate("/menu");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 sm:p-12 relative">
      <div className="w-full max-w-md flex flex-col gap-6 relative">
        {/* Tombol tema di pojok kanan atas */}
        <div className="absolute -top-14 right-2">
          <GlassIconButton onClick={toggleTheme} ariaLabel="Toggle tema">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </GlassIconButton>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <UtensilsCrossed
            className={`h-12 w-12 drop-shadow-md ${
              isDark ? "text-white" : "text-black"
            }`}
          />
          <h1
            className={`text-3xl font-bold tracking-tight drop-shadow-lg ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Asstro ERP
          </h1>
          <p
            className={`text-base font-medium drop-shadow-md ${
              isDark ? "text-white/80" : "text-black/70"
            }`}
          >
            Scan & Order
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              className={`text-sm font-bold drop-shadow-md ml-1 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Nama Pelanggan
            </label>
            <GlassInput
              value={name}
              onChange={setName}
              placeholder="Nama Anda"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className={`text-sm font-bold drop-shadow-md ml-1 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Nomor Meja
            </label>
            <GlassInput
              value={table}
              onChange={setTable}
              placeholder="Contoh: 04"
              required
            />
          </div>

          <GlassButton
            type="submit"
            variant="primary"
            tier="hero"
            className="mt-4"
          >
            Mulai Pesan <ArrowRight className="h-5 w-5" />
          </GlassButton>
        </form>

        <GlassButton variant="secondary">
          <QrCode className="h-5 w-5" /> Scan QR Meja
        </GlassButton>
      </div>
    </div>
  );
};

export default EntryPage;
