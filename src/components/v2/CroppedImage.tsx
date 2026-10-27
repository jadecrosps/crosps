import Image from "next/image";

// Mirrors a Figma image crop: the image is sized and offset as percentages of
// its frame. The frame must keep the Figma aspect ratio for the crop to match.
export type Crop = { width: number; height: number; left: number; top: number };

export function CroppedImage({
  src,
  alt,
  crop,
  sizes,
  className = "",
  loading,
}: {
  src: string;
  alt: string;
  crop?: Crop;
  sizes: string;
  className?: string;
  loading?: "eager" | "lazy";
}) {
  if (!crop) {
    return <Image src={src} alt={alt} fill sizes={sizes} loading={loading} className={`object-cover ${className}`} />;
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute"
        style={{ width: `${crop.width}%`, height: `${crop.height}%`, left: `${crop.left}%`, top: `${crop.top}%` }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} loading={loading} className="object-cover" />
      </div>
    </div>
  );
}
