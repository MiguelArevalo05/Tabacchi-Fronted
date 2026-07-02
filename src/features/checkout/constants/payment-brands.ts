export const PAYMENT_BRAND_ASSETS = {
  yape: {
    src: "/images/payments/yape.webp",
    alt: "Yape",
    imageClassName: "object-cover",
    containerClassName: "rounded-xl",
  },
  plin: {
    src: "/images/payments/plin.png",
    alt: "Plin",
    imageClassName: "object-cover",
    containerClassName: "rounded-full",
  },
} as const;

export const PAYMENT_BRAND_THEMES = {
  yape: {
    accent: "#742284",
    accentDark: "#5c1a6a",
    surface: "#faf5ff",
    surfaceBorder: "#ead6f0",
    selectedBorder: "#742284",
  },
  plin: {
    accent: "#00a19a",
    accentDark: "#00857f",
    surface: "#f0fdfc",
    surfaceBorder: "#b8ebe8",
    selectedBorder: "#00a19a",
  },
} as const;

export type PaymentBrand = keyof typeof PAYMENT_BRAND_ASSETS;
