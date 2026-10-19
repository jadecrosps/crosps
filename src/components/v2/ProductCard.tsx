import Image from "next/image";
import Link from "next/link";
import { Tag } from "./Tag";
import { CroppedImage, type Crop } from "./CroppedImage";

export type ProductCardProps = {
  name: string;
  descriptor: string;
  price: string;
  image: string;
  hoverImage?: string;
  hoverCrop?: Crop;
  tag?: string;
  status?: string;
  href?: string;
};

export function ProductCard({ name, descriptor, price, image, hoverImage, hoverCrop, tag, status, href }: ProductCardProps) {
  const card = (
    <article className="group flex flex-col gap-2">
      <div className="relative aspect-[441/500] overflow-hidden bg-paper">
        <Image src={image} alt={`${name} pack`} fill sizes="(max-width: 768px) 80vw, 33vw" className="object-contain p-[8%]" />
        {hoverImage && (
          <CroppedImage
            src={hoverImage}
            alt=""
            crop={hoverCrop}
            sizes="(max-width: 768px) 140vw, 55vw"
            className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {tag && (
          <div className="absolute left-6 top-6">
            <Tag className={hoverImage ? "transition-colors group-hover:bg-stone group-hover:text-ink" : ""}>{tag}</Tag>
          </div>
        )}
        {status && (
          <p className={`type-label absolute right-6 top-[30px] text-ink ${hoverImage ? "transition-colors group-hover:text-white" : ""}`}>
            {status}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="font-sans text-[18px] leading-[1.2] text-ink">{name}</h3>
        <p className="font-sans text-[16px] leading-[1.2] text-ink-50">{descriptor}</p>
        <p className="type-price text-ink">{price}</p>
      </div>
    </article>
  );

  return href ? (
    <Link href={href} className="block">
      {card}
    </Link>
  ) : (
    card
  );
}
