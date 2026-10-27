"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Feed, Post } from "@behold/types";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { MobileCarousel } from "./MobileCarousel";

const FEED_ID = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID;
const BEHOLD_URL = FEED_ID ? `https://feeds.behold.so/${FEED_ID}` : null;
const PROFILE_URL = "https://www.instagram.com/eatcrosps/";

// Shown until the feed loads, or if it fails.
const FALLBACK = ["/v2/story.jpg", "/v2/insta-2.jpg", "/v2/insta-3.jpg", "/v2/insta-4.jpg"].map((src) => ({
  src,
  alt: "Crosps on Instagram",
  href: PROFILE_URL,
}));

// Figma 1:298: latest four posts from the Behold feed.
export function InstagramFeed() {
  const [posts, setPosts] = useState(FALLBACK);

  useEffect(() => {
    if (!BEHOLD_URL) return;
    let cancelled = false;
    fetch(BEHOLD_URL)
      .then((res) => (res.ok ? (res.json() as Promise<Feed>) : null))
      .then((feed) => {
        if (cancelled || !feed?.posts?.length) return;
        setPosts(
          feed.posts.slice(0, 4).map((p: Post) => ({
            src: p.sizes?.large?.mediaUrl ?? p.mediaUrl,
            alt: p.prunedCaption || p.caption || "Crosps on Instagram",
            href: p.permalink,
          })),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="gutter-x py-20 md:py-28">
      <div className="mb-6 flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <p className="type-label text-ink">Socials</p>
          <h2 className="type-heading">
            Step inside the world of <SerifAccent>Crosps</SerifAccent>
          </h2>
        </div>
        <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer" aria-label="Crosps on Instagram">
          <Image src="/v2/instagram.svg" alt="" width={24} height={24} />
        </a>
      </div>
      <MobileCarousel label="Instagram posts" className="md:grid-cols-2 md:gap-4 lg:grid-cols-4">
        {posts.map((p) => (
          <a key={p.src} href={p.href} target="_blank" rel="noopener noreferrer" className="relative block aspect-[3/4] select-none overflow-hidden [-webkit-touch-callout:none]">
            <Image
              src={p.src}
              alt={p.alt}
              fill
              draggable={false}
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 hover:scale-[1.03]"
              unoptimized={p.src.startsWith("https://") && !p.src.includes("behold")}
            />
          </a>
        ))}
      </MobileCarousel>
    </section>
  );
}
