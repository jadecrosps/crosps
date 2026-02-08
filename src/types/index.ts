export interface Product {
  name: string;
  tagline: string;
  description: string;
  imageSrc: string;
}

export interface Feature {
  title: string;
  titleAccent: string;
  description: string;
}

export interface Ingredient {
  name: string;
  iconSrc: string;
  description?: string;
}

export interface NavLink {
  label: string;
  href: string;
}
