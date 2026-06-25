"use client";
import React, { useEffect, useRef, useState } from "react";
import MenuCard from "@/components/MenuCard";
import { MenuItem } from "@/lib/types";

type Props = {
  items: MenuItem[];
  onSelect?: (it: MenuItem) => void;
  addToCart: (it: MenuItem) => void;
};

export default function MenuCarousel({ items, onSelect, addToCart }: Props) {
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(1);
  const visibleIndex = Math.min(activeIndex, Math.max(0, items.length - 1));

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items.length]);

  useEffect(() => {
    const node = itemRefs.current[visibleIndex];
    if (node) {
      node.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [visibleIndex]);

  if (!items.length) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <div className="-mx-4 flex items-stretch gap-3 overflow-x-auto px-4 pb-7 pt-8 hide-scrollbar snap-x snap-mandatory">
        {items.map((item, idx) => {
          const active = idx === visibleIndex;
          const itemKey = item._id?.trim() || `${item.name || "item"}-${idx}`;
          return (
            <div
              key={itemKey}
              ref={el => {
                itemRefs.current[idx] = el;
              }}
              className={`snap-center shrink-0 transition-all duration-300 ${active ? "w-46.5 sm:w-51 -translate-y-1" : "w-36 sm:w-39 opacity-95"}`}
              onClick={() => setActiveIndex(idx)}
            >
              <div className={active ? "h-87.5" : "h-78"}>
                <MenuCard
                  item={item}
                  idx={idx}
                  onSelect={it => {
                    onSelect?.(it);
                    setActiveIndex(idx);
                  }}
                  addToCart={addToCart}
                  isActive={active}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
