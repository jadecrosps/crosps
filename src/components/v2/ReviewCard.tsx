import Image from "next/image";

export function ReviewCard({ quote, author, rating }: { quote: string; author: string; rating?: number }) {
  return (
    <figure className="flex flex-col items-center gap-6 py-8 text-center">
      {rating === 5 && <Image src="/v2/stars.svg" alt="5 out of 5 stars" width={106} height={18} />}
      <blockquote className="max-w-[272px] font-sans text-[18px] italic leading-[1.2] text-ink">{quote}</blockquote>
      <figcaption className="type-mono text-ink">{author}</figcaption>
    </figure>
  );
}
