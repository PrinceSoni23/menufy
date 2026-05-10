"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MenuItem } from "@/lib/types";

type Props = {
  item: MenuItem;
  idx?: number;
  onSelect?: (it: MenuItem) => void;
  addToCart: (it: MenuItem) => void;
  isActive?: boolean;
};

export default function MenuCard({
  item,
  idx = 0,
  onSelect,
  addToCart,
  isActive = false,
}: Props) {
  const categoryLabel = (item.category || "IndianDish").replace(/\s+/g, "");
  const ingredientText = item.ingredients
    ? Array.isArray(item.ingredients)
      ? item.ingredients.join(", ")
      : String(item.ingredients)
    : item.description || "Rice, Fried Chicken, Special Spices";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: idx * 0.06, duration: 0.55, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
      className="h-full w-full cursor-pointer"
      onClick={() => onSelect?.(item)}
    >
      <div
        className={`relative h-full rounded-[28px] border transition-all duration-300 ${
          isActive
            ? "bg-[#2f8b4e] border-[#247042] text-white shadow-[0_28px_70px_rgba(47,139,78,0.34)]"
            : "bg-[#efe9de] border-[#ddd4c6] text-[#40342d] shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
        }`}
      >
        <div className="relative pt-6.5">
          <div className="mx-auto -mt-10 mb-1 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_12px_24px_rgba(0,0,0,0.16)] ring-4 ring-white/95">
            {item.imageUrl2D ? (
              <Image
                src={item.imageUrl2D}
                alt={item.name}
                width={96}
                height={96}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="text-xl font-black text-[#2f8b4e]">
                {(item.name || "Item").slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="px-3.5 pb-3.25 pt-0.75">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3
                  className={`font-serif font-bold leading-[0.95] tracking-[-0.03em] text-[17px] ${
                    isActive ? "text-white" : "text-[#2f8b4e]"
                  }`}
                >
                  {item.name}
                </h3>
                <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[#4e463e]">
                  Ingredients
                </div>
              </div>

              <div
                className={`text-lg font-black ${isActive ? "text-white" : "text-[#2f8b4e]"}`}
              >
                ₹{Number(item.price).toFixed(0)}
              </div>
            </div>

            {isActive ? (
              <div className="mt-2.5 space-y-1.5 pb-1">
                <div className="text-[11px] leading-tight text-white">
                  {ingredientText}
                </div>

                <div className="pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  Calories
                </div>
                <div className="space-y-1 text-[13px] font-bold leading-[1.18] text-white">
                  {item.calories !== undefined && item.calories !== null ? (
                    <div>{item.calories} kcal</div>
                  ) : (
                    <div className="text-[11px] leading-[1.18] text-white">
                      Total Fat{" "}
                      {Math.max(8, Math.round(Number(item.price) / 2))}g
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-2.5 space-y-1.5 pb-1">
                <div className="text-[11px] leading-tight text-[#5e544d]">
                  {ingredientText}
                </div>

                <div className="pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3d342d]">
                  Calories
                </div>
                <div className="space-y-1 text-[13px] font-bold leading-[1.18] text-[#756961]">
                  {item.calories !== undefined && item.calories !== null ? (
                    <div>{item.calories} kcal</div>
                  ) : (
                    <div className="text-[11px] leading-[1.18] text-[#756961]">
                      Total Fat{" "}
                      {Math.max(8, Math.round(Number(item.price) / 2))}g
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
