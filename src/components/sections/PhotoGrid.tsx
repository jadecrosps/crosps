"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Feed, Post } from "@behold/types";
import { SerifAccent } from "@/components/ui/SerifAccent";

const FEED_ID = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID;
const BEHOLD_URL = FEED_ID ? `https://feeds.behold.so/${FEED_ID}` : null;

const FALLBACK_IMAGES = [
  { src: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=800&fit=crop", alt: "Fresh vegetables", href: "#" },
  { src: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop", alt: "Ripe tomatoes", href: "#" },
  { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop", alt: "Vegetable preparation", href: "#" },
  { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=400&fit=crop", alt: "Farm landscape", href: "#" },
];

function SkeletonCard() {
  return (
    <div className="relative h-[500px] w-full animate-pulse rounded-lg bg-crosps-gray-light" />
  );
}

export function PhotoGrid() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(!!BEHOLD_URL);
  const [useFallback, setUseFallback] = useState(!BEHOLD_URL);

  useEffect(() => {
    if (!BEHOLD_URL) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetch(BEHOLD_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Feed failed");
        return res.json() as Promise<Feed>;
      })
      .then((data) => {
        if (!cancelled && data?.posts?.length) {
          setFeed(data);
          setUseFallback(false);
        } else {
          setUseFallback(true);
        }
      })
      .catch(() => setUseFallback(true))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const posts: { src: string; alt: string; href: string }[] = useFallback
    ? FALLBACK_IMAGES
    : (feed?.posts ?? [])
        .slice(0, 4)
        .map((p: Post) => ({
          src: p.sizes?.large?.mediaUrl ?? p.mediaUrl,
          alt: p.prunedCaption || p.caption || "Instagram post",
          href: p.permalink,
        }));

  return (
    <section className="bg-white py-20 md:py-28 lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        {/* Header: two columns per Figma */}
        <div className="mb-10 grid gap-8 md:grid-cols-2 md:gap-12 lg:mb-12">
          <div>
            <p
              className="mb-2 text-[length:var(--text-label)] font-medium uppercase tracking-wide text-crosps-charcoal"
              style={{ fontSize: "12px" }}
            >
              SOCIAL MEDIA
            </p>
            <h2 className="text-[length:var(--text-saans-40)] font-normal tracking-tight text-crosps-charcoal md:text-4xl">
              Step inside the world of <SerifAccent>Crosps</SerifAccent>
            </h2>
          </div>
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-[length:var(--text-saans-18)] text-[var(--color-crosps-charcoal-88)]">
              A look behind the scenes, early tastings, and the moments that
              shape Crosps. Don&apos;t miss out.
            </p>
            <a
              href="https://www.instagram.com/eatcrosps/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center justify-center border-2 border-crosps-charcoal bg-transparent px-6 py-3 text-[length:var(--text-button)] font-medium uppercase tracking-wide text-crosps-charcoal transition-colors hover:bg-crosps-charcoal hover:text-white"
            >
              FOLLOW OUR SOCIALS
            </a>
          </div>
        </div>

        {/* Grid: 4 images, 500px height, 16px gap */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : posts.map((item, i) => (
                <a
                  key={useFallback ? item.alt : item.href + i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative h-[500px] w-full overflow-hidden rounded-lg"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized={item.src.startsWith("https://") && !item.src.includes("behold")}
                  />
                </a>
              ))}
        </div>
      </div>
    </section>
  );
}
