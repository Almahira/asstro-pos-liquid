import React, { useEffect, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAppStore } from "./store/useAppStore";

// ✅ Impor Scene, bukan ImageBackground + LiquidDroplet langsung
import Scene from "./components/Scene";
import EntryPage from "./pages/EntryPage";
import MenuPage from "./pages/MenuPage";

const SplashLoading = () => (
  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0f19] text-white">
    <Loader2 className="h-10 w-10 animate-spin text-[#d97706]" />
    <p className="mt-4 font-medium tracking-widest uppercase text-sm animate-pulse opacity-70">
      Memuat Sistem...
    </p>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full"
            >
              <EntryPage />
            </motion.div>
          }
        />
        <Route
          path="/menu"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full"
            >
              <MenuPage />
            </motion.div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="relative h-dvh w-full bg-black overflow-hidden selection:bg-primary/30">
        <Suspense fallback={<SplashLoading />}>
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas
              camera={{ position: [0, 0, 6], fov: 45 }}
              dpr={[1, 2]}
              gl={{ localClippingEnabled: true }}
            >
              <Scene />
            </Canvas>
          </div>

          <div className="absolute inset-0 z-10 pointer-events-auto flex items-center justify-center">
            <AnimatedRoutes />
          </div>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default App;
