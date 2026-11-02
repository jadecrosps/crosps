import Image from "next/image";
import { Button } from "./Button";
import { Divider } from "./SectionHeading";
import { SerifAccent } from "@/components/ui/SerifAccent";

export const STORY_PARAGRAPHS = [
  "Most savoury snacks are still built around potato, grains or starch, with vegetables playing a supporting role. We wanted something simple. Something made from vegetables that still looked and tasted like vegetables.",
  "So we started with the vegetable itself.",
  "Real slices of tomato, onion and pepper. Ingredients you can see. Shapes that are naturally irregular. Colour, texture and flavour that still feel connected to where they came from.",
  "The result is something familiar, but distinctly different.",
  "Crisp enough to satisfy the craving. Considered enough to feel like something new.",
  "A different way to think about vegetables. And a different kind of crisp.",
];

// Figma "Desktop / Product Section" 35:2036: story copy left, gallery photo right.
export function StorySection({ image = "/v2/story.jpg", href = "#" }: { image?: string; href?: string }) {
  return (
    <section className="gutter-x py-20 md:py-28">
      <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-16">
        <div className="flex flex-col justify-between gap-10 lg:w-[557px] lg:shrink-0">
          <div className="flex flex-col gap-[30px]">
            <Divider className="max-w-[514px]" />
            <h2 className="font-sans text-[26px] leading-[1.1] text-ink md:text-[31px]">
              We didn’t want to make another <SerifAccent>crisp.</SerifAccent>
            </h2>
            <div className="flex max-w-[514px] flex-col gap-[25px] font-sans text-[16px] leading-[1.4] text-ink md:text-[18px]">
              {STORY_PARAGRAPHS.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div>
            <Button href={href}>Our Story</Button>
          </div>
        </div>
        {/* Keeps the Figma frame ratio (787×737) at every width. */}
        <div className="relative aspect-[787/737] w-full min-w-0 self-start lg:max-w-[800px] lg:flex-1">
          <Image src={image} alt="A pepper crisp next to a fresh slice of pepper" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
