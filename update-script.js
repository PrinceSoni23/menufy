const fs = require('fs');

const codeToInject = \"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { showToast } from "@/components/common/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem } from "@/lib/types";
import Script from "next/script";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": any;
    }
  }
}

// Subcomponents

const IntroCinematic = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0806] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 1.5, delay: 2.5, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3a2818] via-[#0a0806] to-[#0a0806] opacity-60"></div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-24 h-24 border border-[#d4af37] rounded-full flex items-center justify-center p-2 mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          <div className="text-5xl">???</div>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-[#d4af37] tracking-widest uppercase mb-2">MENU</h1>
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
        <p className="text-[#f8f3e6] mt-4 font-light tracking-[0.2em] text-sm opacity-80">A CULINARY EXPERIENCE</p>
      </motion.div>
    </motion.div>
  );
};

export default function PublicMenuPage() {
  const params = useParams();
  const publicUrl = params?.publicUrl as string;

  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [introDone, setIntroDone] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [turnDirection, setTurnDirection] = useState(1);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "3d">("details");
  const [cart, setCart] = useState<{item: MenuItem, qty: number}[]>([]);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");
  
  // Load data
  useEffect(() => {
    const loadMenuData = async () => {
      if (!publicUrl) {
        setError("Invalid menu URL");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const qrResponse = await fetch(\\\\\\/qrcode/public/\\\\\\);
        const qrData = await qrResponse.json();
        if (!qrResponse.ok || !qrData.data?.restaurantId) {
          throw new Error(qrData.message || "Restaurant not found");
        }
        const rId = qrData.data.restaurantId;
        setRestaurantId(rId);

        try {
          const restaurantRes = await fetch(\\\\\\/restaurants/\\\\\\);
          if (restaurantRes.ok) {
            const restaurantData = await restaurantRes.json();
            setRestaurant(restaurantData?.data || restaurantData);
          }
        } catch (err) {
          console.warn("Could not load restaurant details:", err);
        }

        const menuResponse = await fetch(\\\\\\/menu/public/\\\\\\);
        const menuData = await menuResponse.json();
        if (!menuResponse.ok) {
          throw new Error(menuData.message || "Failed to load menu items");
        }
        const items = menuData?.data?.menuItems || menuData?.data || [];
        setMenuItems(Array.isArray(items) ? items : []);
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || "Failed to load menu";
        setError(errorMsg);
        showToast(errorMsg, "error");
      } finally {
        setLoading(false);
      }
    };
    loadMenuData();
  }, [publicUrl]);

  // Data processing
  const categories = Array.from(new Set(menuItems.map(item => item.category || "Other"))).sort();
  let currentCategory = categories[selectedCategoryIndex] || "all";
  
  const handleTurnPage = (idx: number) => {
    if (idx === selectedCategoryIndex) return;
    setTurnDirection(idx > selectedCategoryIndex ? 1 : -1);
    setSelectedCategoryIndex(idx);
  };

  // Filtered items logic
  let displayItems = menuItems.filter(item => item.category === currentCategory);
  if (searchQuery) {
    displayItems = menuItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  
  // Animation Variants
  const pageVariants = {
    enter: (dir: number) => ({ opacity: 0, rotateY: dir > 0 ? 30 : -30, x: dir > 0 ? 50 : -50, scale: 0.95, filter: "blur(4px)" }),
    center: { opacity: 1, rotateY: 0, x: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } },
    exit: (dir: number) => ({ opacity: 0, rotateY: dir < 0 ? 30 : -30, x: dir < 0 ? 50 : -50, scale: 0.95, filter: "blur(4px)", transition: { duration: 0.4 } })
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item._id === item._id);
      if (existing) {
        return prev.map(i => i.item._id === item._id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { item, qty: 1 }];
    });
    showToast(\\\\\\ added\\\, "success");
    setSelectedDish(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0806] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0806] flex flex-col items-center justify-center px-4">
        <div className="text-5xl border border-[#d4af37]/30 rounded-full p-4 mb-6">??</div>
        <h2 className="text-[#f8f3e6] text-3xl font-serif mb-2">We Apologize</h2>
        <p className="text-[#d4af37] text-lg mb-8 font-light text-center">{error}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 border border-[#d4af37] text-[#d4af37] rounded-full uppercase tracking-widest text-sm hover:bg-[#d4af37] hover:text-black transition-colors">Retry Search</button>
      </div>
    );
  }

  return (
    <>
      <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js" />
      {!introDone && <IntroCinematic onComplete={() => setIntroDone(true)} />}

      <div className="min-h-screen bg-[#120E0A] text-[#f8f3e6] font-sans selection:bg-[#d4af37] selection:text-black overflow-x-hidden pb-32">
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2a1c11]/40 via-[#120E0A] to-[#0a0806]"></div>

        <div className="relative z-10 max-w-lg mx-auto md:max-w-5xl">
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="pt-12 pb-6 px-6 text-center"
          >
            <h1 className="text-3xl md:text-5xl font-serif text-[#d4af37] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">{restaurant?.name || "Premium Menu"}</h1>
            <p className="text-sm md:text-base tracking-[0.3em] mt-4 opacity-70 uppercase text-[#f8f3e6]">{restaurant?.description || "A Digital Culinary Journey"}</p>
            <div className="mt-8 flex items-center justify-center">
              <div className="h-[1px] w-full max-w-[120px] bg-gradient-to-r from-transparent to-[#d4af37]/60"></div>
              <div className="w-2 h-2 rotate-45 bg-[#d4af37] mx-4 shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
              <div className="h-[1px] w-full max-w-[120px] bg-gradient-to-l from-transparent to-[#d4af37]/60"></div>
            </div>
          </motion.header>

          <div className="px-4 sticky top-0 z-40 bg-[#120E0A]/80 backdrop-blur-xl py-4 border-b border-[#d4af37]/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)] transition-all">
            <div className="relative mb-5 max-w-md mx-auto">
              <input 
                type="text" 
                placeholder="Search our offerings..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1F1812]/80 border border-[#d4af37]/30 text-[#f8f3e6] px-5 py-3 pl-12 rounded-full focus:outline-none focus:border-[#d4af37] transition-all placeholder:text-[#f8f3e6]/40 font-light shadow-inner"
              />
              <svg className="w-5 h-5 absolute left-4 top-3.5 text-[#d4af37]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>

            {!searchQuery && categories.length > 0 && (
              <div className="flex overflow-x-auto hide-scrollbar gap-3 px-2 py-2 snap-x snap-mandatory">
                {categories.map((cat, idx) => (
                  <button
                    key={cat}
                    onClick={() => handleTurnPage(idx)}
                    className={\shrink-0 snap-center px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-serif tracking-widest transition-all duration-300 \\\\}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative mt-8 px-4" style={{ perspective: "2000px" }}>
            <AnimatePresence custom={turnDirection} mode="wait">
              <motion.div
                key={searchQuery ? 'search' : currentCategory}
                custom={turnDirection}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 origin-center"
              >
                {displayItems.length > 0 ? (
                  displayItems.map((item, idx) => (
                     <motion.div
                      key={item._id}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDish(item)}
                      className="bg-gradient-to-b from-[#1F1812] to-[#16110c] border border-[#d4af37]/20 rounded-xl overflow-hidden cursor-pointer shadow-xl hover:border-[#d4af37]/50 hover:shadow-[0_15px_40px_-5px_rgba(212,175,55,0.2)] transition-all duration-300 group flex flex-col h-full"
                    >
                      <div className="relative h-60 overflow-hidden bg-[#0a0806]">
                        {item.imageUrl2D ? (
                          <motion.img 
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            src={item.imageUrl2D} 
                            alt={item.name} 
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity mix-blend-luminosity hover:mix-blend-normal"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#d4af37]/30 bg-[#16110c]">
                            <svg className="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <span className="text-xs uppercase tracking-widest">Image unavailable</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1812] via-transparent to-transparent opacity-80"></div>
                        
                        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                          {item.arEnabled && (
                            <div className="bg-black/70 backdrop-blur-md border border-[#d4af37]/50 text-[#d4af37] px-3 py-1.5 rounded text-xs font-bold tracking-widest flex items-center gap-2 shadow-lg w-max">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                              3D / AR
                            </div>
                          )}
                          {item.isVegetarian && (
                            <div className="bg-emerald-900/80 text-emerald-400 border border-emerald-700/50 px-2 py-1 rounded text-[10px] font-bold shadow-lg uppercase tracking-wider w-max">
                              Vegetarian
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl md:text-2xl font-serif text-[#f8f3e6] group-hover:text-[#d4af37] transition-colors mb-1 pr-4 line-clamp-2">{item.name}</h3>
                            <span className="text-xl md:text-2xl text-[#d4af37] font-serif shrink-0">$\\\</span>
                          </div>
                          <div className="w-12 h-[1px] bg-[#d4af37]/40 mb-4 transition-all duration-300 group-hover:w-24 group-hover:bg-[#d4af37]"></div>
                          {item.description && (
                            <p className="text-[#f8f3e6]/60 text-sm font-light line-clamp-2 md:line-clamp-3 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center border border-dashed border-[#d4af37]/20 rounded-2xl">
                    <p className="text-[#d4af37] font-serif text-2xl opacity-60">No culinary delights found for this selection.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selectedDish && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4"
              >
                <div className="absolute inset-0" onClick={() => setSelectedDish(null)}></div>
                <motion.div 
                  initial={{ y: "100%", scale: 0.95 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: "100%", scale: 0.95 }}
                  transition={{ type: "spring", damping: 28, stiffness: 200 }}
                  className="relative z-10 w-full max-w-3xl bg-[#120E0A] sm:rounded-2xl rounded-t-3xl overflow-hidden border border-[#d4af37]/30 shadow-[0_-10px_50px_rgba(0,0,0,0.8)] max-h-[90vh] flex flex-col"
                >
                  <button 
                    onClick={() => setSelectedDish(null)}
                    className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur border border-[#d4af37]/30 p-2.5 rounded-full text-[#f8f3e6]/80 hover:text-[#d4af37] hover:border-[#d4af37] transition-all group shadow-xl"
                  >
                    <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="flex-1 overflow-y-auto hide-scrollbar">
                    <div className="relative h-[40vh] sm:h-[50vh] bg-[#0a0806] flex items-center justify-center overflow-hidden">
                      <AnimatePresence mode="wait">
                        {activeTab === 'details' ? (
                          <motion.img 
                            key="image"
                            initial={{ opacity: 0, scale: 1.05 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            src={selectedDish.imageUrl2D || "/placeholder.jpg"} 
                            alt={selectedDish.name}
                            className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                          />
                        ) : (
                          <motion.div key="3d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                            {selectedDish.modelUrl3D ? (
                              <model-viewer
                                src={selectedDish.modelUrl3D}
                                auto-rotate
                                camera-controls
                                shadow-intensity="1"
                                ar
                                ar-modes="webxr scene-viewer quick-look"
                                style={{ width: '100%', height: '100%', backgroundColor: '#0a0806' }}
                                environment-image="neutral"
                                auto-rotate-delay="100"
                                rotation-per-second="30deg"
                              ></model-viewer>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-[#d4af37]/30 font-serif">
                                <span className="text-4xl mb-4">??</span>
                                <p className="uppercase tracking-widest text-sm">3D model not available</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {selectedDish.arEnabled && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1 p-1 bg-black/60 backdrop-blur-md rounded-full border border-[#d4af37]/20 shadow-2xl">
                          <button 
                            onClick={() => setActiveTab('details')}
                            className={\px-6 py-2 text-xs font-bold rounded-full transition-all uppercase tracking-widest \\\\}
                          >
                            Photography
                          </button>
                          <button 
                            onClick={() => setActiveTab('3d')}
                            className={\px-6 py-2 text-xs font-bold rounded-full transition-all uppercase tracking-widest \\\\}
                          >
                            Interactive
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-6 md:p-10 relative">
                      <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"></div>
                      
                      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 pt-4">
                        <div>
                          <h2 className="text-3xl md:text-4xl font-serif text-[#f8f3e6] leading-tight mb-3">{selectedDish.name}</h2>
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] border border-[#d4af37]/30 px-3 py-1 rounded-sm">{selectedDish.category}</span>
                            {selectedDish.isVegetarian && <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-sm">Vegetarian</span>}
                          </div>
                        </div>
                        <span className="text-4xl text-[#d4af37] font-serif md:text-right shrink-0">$\\\</span>
                      </div>

                      <div className="space-y-8 text-[#f8f3e6]/80 font-light leading-relaxed text-lg">
                        <p className="italic text-[#f8f3e6]/90 border-l-2 border-[#d4af37] pl-4">
                          {selectedDish.description || "The chef has meticulously crafted this dish to provide an unforgettable gastronomic journey."}
                        </p>
                        
                        <div className="bg-[#1F1812]/50 p-6 rounded-xl border border-[#d4af37]/10 flex flex-col md:flex-row gap-6 md:gap-12 md:items-center">
                           <div className="flex-1 flex flex-col gap-1">
                             <span className="text-[#f8f3e6]/50 text-xs uppercase tracking-widest">Prep Time</span>
                             <span className="font-serif text-[#d4af37] text-xl">~15-20 min</span>
                           </div>
                           <div className="hidden md:block w-[1px] h-12 bg-[#d4af37]/20"></div>
                           <div className="flex-1 flex flex-col gap-1">
                             <span className="text-[#f8f3e6]/50 text-xs uppercase tracking-widest">Chef's Note</span>
                             <span className="font-serif text-[#d4af37] text-xl">Recommendation ?</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 md:p-6 border-t border-[#d4af37]/20 bg-[#0a0806] flex items-center justify-between gap-4 sticky bottom-0 z-20">
                     {activeTab === '3d' && selectedDish.modelUrl3D ? (
                        <button 
                        onClick={() => {
                          const modelViewer = document.querySelector('model-viewer') as any;
                          if(modelViewer && modelViewer.activateAR) modelViewer.activateAR();
                        }}
                        className="flex-1 bg-white text-black py-4 rounded-xl font-bold tracking-widest text-sm md:text-base hover:bg-gray-200 transition-colors uppercase flex items-center justify-center gap-3"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        View On My Table (AR)
                      </button>
                     ) : (
                       <button 
                        onClick={() => addToCart(selectedDish)}
                        className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#b38e21] text-black py-4 rounded-xl font-bold tracking-widest text-sm md:text-base hover:brightness-110 transition-all uppercase flex items-center justify-center gap-3"
                      >
                        Add to Order &nbsp; — &nbsp; $\\\
                      </button>
                     )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {cart.length > 0 && !selectedDish && (
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:min-w-[400px] z-40 bg-gradient-to-r from-[#1F1812] to-[#0a0806] border border-[#d4af37]/50 text-[#f8f3e6] p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex justify-between items-center backdrop-blur-xl"
              >
                <div className="pl-2">
                  <p className="text-[10px] text-[#d4af37] font-bold uppercase tracking-[0.2em] mb-1">Your Selection</p>
                  <p className="font-serif text-2xl leading-none">$\\\</p>
                </div>
                <button className="bg-[#d4af37] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:brightness-110 transition-all">
                  Review Order ({cart.reduce((acc, curr) => acc + curr.qty, 0)})
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <style jsx global>{\
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      \}</style>
    </>
  );
}\;
fs.writeFileSync('c:/Users/princ/OneDrive/Desktop/menu/frontend/app/menu/[publicUrl]/page.tsx', codeToInject, 'utf8');
