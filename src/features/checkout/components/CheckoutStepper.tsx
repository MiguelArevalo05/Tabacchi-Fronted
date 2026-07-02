"use client";

import { Check } from "lucide-react";

import { CHECKOUT_STEPS } from "@/features/checkout/constants";
import type { CheckoutStep } from "@/features/checkout/types";

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
  allStepsCompleted?: boolean;
}

export default function CheckoutStepper({
  currentStep,
  allStepsCompleted = false,
}: CheckoutStepperProps) {
  return (
    <nav
      aria-label="Progreso del pedido"
      className="w-full rounded-2xl border border-[#e3e7ee] bg-white p-4 shadow-sm sm:p-5"
    >
      <ol className="grid gap-3 lg:grid-cols-4">
        {CHECKOUT_STEPS.map((item) => {
          const isCompleted = allStepsCompleted || item.step < currentStep;
          const isActive = !allStepsCompleted && item.step === currentStep;

          return (
            <li
              key={item.step}
              className={[
                "rounded-xl border px-4 py-4 transition-colors",
                isActive
                  ? "border-[#17245c] bg-[#f3f8ff] ring-1 ring-[#17245c]"
                  : isCompleted
                    ? "border-[#dbeafe] bg-[#f8fbff]"
                    : "border-[#e8ebf0] bg-[#fafbfc]",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <span
                  className={[
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    isCompleted || isActive
                      ? "bg-[#17245c] text-white"
                      : "bg-[#e8ebf0] text-[#8b93a1]",
                  ].join(" ")}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : item.step}
                </span>
                <div className="min-w-0">
                  <p
                    className={[
                      "text-[14px] font-bold leading-snug",
                      isActive || isCompleted ? "text-[#17245c]" : "text-[#8b93a1]",
                    ].join(" ")}
                  >
                    {item.label}
                  </p>
                  <p
                    className={[
                      "mt-1 text-[12px] leading-snug",
                      isCompleted
                        ? "font-medium text-[#1f8f4a]"
                        : isActive
                          ? "text-[#5b6472]"
                          : "text-[#b0b7c3]",
                    ].join(" ")}
                  >
                    {isCompleted ? "Completado" : item.subtitle}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
