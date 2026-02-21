"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className={`group flex flex-col gap-6 transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      {/* Image frame — clips bottom edge, allows overflow above on hover */}
      <div
        className="relative h-[213px]"
        style={{
          backgroundColor: product.bgColor,
          clipPath: "inset(-200px 0 0 0)",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 flex justify-center translate-y-[25%] group-hover:translate-y-[calc(25%-48px)] transition-transform duration-300 ease-out">
          <Image
            src={product.imageSrc}
            alt={`${product.name} crisps`}
            width={280}
            height={280}
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col items-center gap-4 px-2 text-center">
        <h3 className="text-[32px] font-normal leading-[1.2] text-crosps-charcoal">
          {product.name}
        </h3>
        <div className="flex flex-col gap-2 items-center w-full">
          <p className="font-serif text-[24px] leading-[1.2] text-crosps-charcoal">
            {product.tagline}
          </p>
        </div>
      </div>
    </article>
  );
}
