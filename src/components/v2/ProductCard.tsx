import Image from "next/image";
import { Tag } from "./Tag";

export type ProductCardProps = {
  name: string;
  descriptor: string;
  price: string;
  image: string;
  tag?: string;
  status?: string;
};

export function ProductCard({ name, descriptor, price, image, tag, status }: ProductCardProps) {
  return (
    <article className="group flex flex-col gap-2">
      <div className="relative aspect-[440/500] overflow-hidden bg-paper">
        <Image
          src={image}
          alt={`${name} pack`}
          fill
          sizes="(max-width: 768px) 80vw, 33vw"
          className="object-contain p-[8%] transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {tag && (
          <div className="absolute left-6 top-6">
            <Tag>{tag}</Tag>
          </div>
        )}
        {status && <p className="type-label absolute right-6 top-[30px] text-ink">{status}</p>}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="font-sans text-[18px] leading-[1.2] text-ink">{name}</h3>
        <p className="font-sans text-[16px] leading-[1.2] text-ink-50">{descriptor}</p>
        <p className="type-price text-ink">{price}</p>
      </div>
    </article>
  );
}
