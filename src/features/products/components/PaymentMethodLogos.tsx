import Image from "next/image";

import { PAYMENT_BRAND_ASSETS } from "@/features/checkout/constants/payment-brands";

const PAYMENT_METHODS = [
  { name: "Visa", src: "/images/payments/visa.svg", width: 48, height: 16 },
  { name: PAYMENT_BRAND_ASSETS.yape.alt, src: PAYMENT_BRAND_ASSETS.yape.src, width: 32, height: 32 },
  { name: PAYMENT_BRAND_ASSETS.plin.alt, src: PAYMENT_BRAND_ASSETS.plin.src, width: 32, height: 32 },
] as const;

export default function PaymentMethodLogos() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2.5">
      {PAYMENT_METHODS.map((method) => (
        <span
          key={method.name}
          className="inline-flex h-9 min-w-[3.25rem] items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white px-2.5"
        >
          <Image
            src={method.src}
            alt={method.name}
            width={method.width}
            height={method.height}
            className="max-h-6 w-auto object-contain"
          />
        </span>
      ))}
    </div>
  );
}
