import { ABOUT_VALUES } from "@/lib/constants";

const CIRCLED_NUMBERS = ["①", "②", "③", "④"];

export function ValuesList() {
  return (
    <section className="bg-crosps-offwhite py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <ul className="mx-auto flex max-w-[560px] flex-col items-center gap-6 text-center">
          {ABOUT_VALUES.map((value, index) => (
            <li key={value} className="flex items-center justify-center gap-4">
              <span className="font-serif text-[24px] leading-none text-crosps-charcoal">
                {CIRCLED_NUMBERS[index]}
              </span>
              <span className="text-[18px] leading-[1.5] text-crosps-charcoal md:text-[20px]">
                {value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
