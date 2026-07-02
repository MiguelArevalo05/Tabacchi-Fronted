import type { ReactNode, SelectHTMLAttributes } from "react";

import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";

export const checkoutInputClassName =
  "h-12 w-full rounded-xl border border-[#d7dce5] bg-white px-4 text-[15px] text-[#17245c] outline-none ring-[#17245c] transition placeholder:text-[#b0b7c3] focus:border-[#17245c] focus:ring-2";

export const checkoutSelectClassName =
  "h-12 w-full cursor-pointer appearance-none rounded-xl border border-[#d7dce5] bg-[#fafbfc] px-4 pr-11 text-[15px] text-[#17245c] shadow-sm outline-none ring-[#17245c] transition hover:border-[#b8c0cc] hover:bg-white focus:border-[#17245c] focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#f0f2f5] disabled:text-[#8b93a1]";

export const checkoutTextareaClassName =
  "w-full resize-none rounded-xl border border-[#d7dce5] bg-white px-4 py-3.5 text-[15px] text-[#17245c] outline-none ring-[#17245c] transition placeholder:text-[#b0b7c3] focus:border-[#17245c] focus:ring-2";

export const checkoutNoticeClassName =
  "rounded-xl border border-[#dbeafe] bg-[#f3f8ff] px-5 py-4 text-[14px] leading-relaxed text-[#17245c]";

export const checkoutFieldGridClassName = "grid gap-6 sm:grid-cols-2";

export const checkoutActionsClassName =
  "flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between";

export function RequiredMark() {
  return <span className="ml-0.5 text-[#d71920]">*</span>;
}

interface CheckoutStepShellProps {
  children: ReactNode;
  footer?: ReactNode;
}

export function CheckoutStepShell({ children, footer }: CheckoutStepShellProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#e3e7ee] bg-white shadow-[0_8px_30px_rgba(23,36,92,0.04)]">
      <div className="space-y-10 p-6 sm:p-8 lg:p-10 xl:p-12">{children}</div>
      {footer ? (
        <div className="border-t border-[#e8ebf0] bg-[#fafbfc] px-6 py-6 sm:px-8 lg:px-10 xl:px-12">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

interface CheckoutStepHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export function CheckoutStepHeader({ icon: Icon, title, subtitle }: CheckoutStepHeaderProps) {
  return (
    <div className="flex items-start gap-4 border-b border-[#eef1f5] pb-8">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef2f7] text-[#17245c]">
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0 pt-0.5">
        <h2 className="text-[26px] font-bold leading-tight text-[#17245c] sm:text-[28px]">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#8b93a1]">{subtitle}</p>
      </div>
    </div>
  );
}

interface CheckoutFormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function CheckoutFormSection({
  title,
  description,
  children,
  className = "",
}: CheckoutFormSectionProps) {
  return (
    <section className={`space-y-6 ${className}`.trim()}>
      {title ? (
        <div className="space-y-1">
          <h3 className="text-[16px] font-bold text-[#17245c]">{title}</h3>
          {description ? (
            <p className="text-[14px] leading-relaxed text-[#8b93a1]">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

interface CheckoutFieldProps {
  label: ReactNode;
  htmlFor?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

export function CheckoutField({
  label,
  htmlFor,
  hint,
  className = "",
  children,
}: CheckoutFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2.5 block text-[14px] font-semibold text-[#17245c]">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-2 text-[13px] leading-relaxed text-[#8b93a1]">{hint}</p> : null}
    </div>
  );
}

interface CheckoutSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

export function CheckoutSelect({
  placeholder,
  className = "",
  children,
  ...props
}: CheckoutSelectProps) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`${checkoutSelectClassName} ${className}`.trim()}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#17245c]/70"
        aria-hidden
      />
    </div>
  );
}
