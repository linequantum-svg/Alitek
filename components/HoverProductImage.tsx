"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type HoverProductImageProps = {
  alt: string;
  image?: string;
  images?: string[];
  sizes: string;
  priority?: boolean;
  className?: string;
};

export default function HoverProductImage({
  alt,
  image,
  images,
  sizes,
  priority = false,
  className,
}: HoverProductImageProps) {
  const galleryImages = useMemo(() => {
    const merged = [image, ...(images ?? [])]
      .map((item) => String(item || "").trim())
      .filter(Boolean);
    return Array.from(new Set(merged));
  }, [image, images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentImage = galleryImages[activeIndex] || image || "/no-image.png";

  useEffect(() => {
    setActiveIndex(0);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [image, images]);

  const startHoverPreview = () => {
    if (galleryImages.length <= 1 || intervalRef.current) return;

    setActiveIndex((prev) => (prev + 1) % galleryImages.length);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % galleryImages.length);
    }, 900);
  };

  const stopHoverPreview = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveIndex(0);
  };

  return (
    <div
      className={className}
      onMouseEnter={startHoverPreview}
      onMouseLeave={stopHoverPreview}
      onFocus={startHoverPreview}
      onBlur={stopHoverPreview}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "block",
      }}
    >
      <Image
        src={currentImage}
        alt={alt}
        fill
        sizes={sizes}
        style={{ objectFit: "contain" }}
        unoptimized
        priority={priority}
      />
    </div>
  );
}
