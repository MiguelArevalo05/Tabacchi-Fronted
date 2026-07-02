"use client";

import Image from "next/image";

import {
  PAYMENT_BRAND_ASSETS,
  PAYMENT_BRAND_THEMES,
  type PaymentBrand,
} from "@/features/checkout/constants/payment-brands";

export { PAYMENT_BRAND_ASSETS, PAYMENT_BRAND_THEMES, type PaymentBrand };

interface PaymentBrandImageProps {
  brand: PaymentBrand;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-12 w-12",
};

export function PaymentBrandImage({
  brand,
  size = "md",
  className = "",
}: PaymentBrandImageProps) {
  const asset = PAYMENT_BRAND_ASSETS[brand];

  return (
    <span
      className={[
        "relative inline-flex shrink-0 overflow-hidden bg-white ring-1 ring-[#e8ebf0]",
        sizeMap[size],
        asset.containerClassName,
        className,
      ].join(" ")}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        sizes="48px"
        className={asset.imageClassName}
      />
    </span>
  );
}

export function YapeLogo() {
  return (
    <div className="mt-2">
      <PaymentBrandImage brand="yape" size="sm" />
    </div>
  );
}

export function PlinLogo() {
  return (
    <div className="mt-2">
      <PaymentBrandImage brand="plin" size="sm" />
    </div>
  );
}
