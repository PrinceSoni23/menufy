"use client";
import { useEffect, useState, ImgHTMLAttributes } from "react";
import { API_BASE_URL } from "@/lib/constants";
import {
  getCachedResponse,
  putCachedResponse,
  fetchViaProxy,
} from "@/lib/mediaCache";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export default function CachedImage({ src, alt, ...rest }: Props) {
  const [srcToUse, setSrcToUse] = useState<string>(src);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    async function load() {
      if (!src || cancelled) return;
      // If it's already a data/blob or same-origin, use directly
      if (
        src.startsWith("data:") ||
        src.startsWith("blob:") ||
        /^https?:\/\//i.test(src) === false
      ) {
        console.info(`[CachedImage] DIRECT SOURCE ${src}`);
        if (!cancelled) setSrcToUse(src);
        return;
      }

      try {
        if (cancelled) return;
        const cached = await getCachedResponse(src);
        if (cancelled) return;
        if (cached) {
          const blob = await cached.blob();
          objectUrl = URL.createObjectURL(blob);
          console.info(`[CachedImage] FRONTEND CACHE -> ${src}`);
          if (!cancelled) setSrcToUse(objectUrl);
          return;
        }

        // Fetch via proxy to avoid CORS and to allow server cache
        const apiBase = (
          API_BASE_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:5000/api"
        ).replace(/\/$/, "");
        const resp = await fetchViaProxy(apiBase, src);
        if (cancelled) return;
        if (!resp.ok) {
          // fallback to direct URL
          console.warn(`[CachedImage] PROXY FAILED -> DIRECT SOURCE ${src}`);
          if (!cancelled) setSrcToUse(src);
          return;
        }

        const sourceLabel = resp.headers.get("X-Media-Source") || "cloudinary";
        console.info(`[CachedImage] ${sourceLabel.toUpperCase()} -> ${src}`);
        const cloned = resp.clone();
        // Store original URL as key in Cache Storage
        await putCachedResponse(src, cloned);
        if (cancelled) return;
        const blob = await resp.blob();
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) setSrcToUse(objectUrl);
      } catch (err) {
        if (!cancelled) {
          console.warn("CachedImage load error", err);
          setSrcToUse(src);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return <img src={srcToUse} alt={alt} {...rest} />;
}
