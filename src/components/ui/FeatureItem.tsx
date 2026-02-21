import type { Feature } from "@/types";
import { SerifAccent } from "@/components/ui/SerifAccent";

interface FeatureItemProps {
  feature: Feature;
}

export function FeatureItem({ feature }: FeatureItemProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-serif text-[32px] leading-[1.2] text-crosps-charcoal">
        {feature.title}
        <SerifAccent>{feature.titleAccent}</SerifAccent>
      </h3>
      <p className="text-[18px] leading-[1.5] text-crosps-charcoal-88">
        {feature.description}
      </p>
    </div>
  );
}
