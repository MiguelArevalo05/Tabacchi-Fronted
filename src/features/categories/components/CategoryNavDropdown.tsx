"use client";

import { ChevronDown } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useCategories } from "@/features/categories/hooks/useCategories";

interface CategoryNavDropdownProps {
  transparent?: boolean;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export default function CategoryNavDropdown({
  transparent = false,
  variant = "desktop",
  onNavigate,
}: CategoryNavDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSlug = pathname === "/productos" ? searchParams.get("categoria") : null;

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: categoriesResponse } = useCategories({ limit: 50 });
  const categories = categoriesResponse?.data ?? [];

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const isActive = pathname === "/productos" && Boolean(activeSlug);

  const navigateToCategory = (slug?: string) => {
    router.push(slug ? `/productos?categoria=${slug}` : "/productos");
    setOpen(false);
    onNavigate?.();
  };

  const textClass = transparent ? "text-white" : "text-[#17245c]";
  const activeClass = isActive
    ? `after:absolute after:-bottom-1 after:left-0 after:h-1 after:w-full after:rounded-full ${
        transparent ? "after:bg-[#d71920]" : "after:bg-[#17245c]"
      }`
    : "";

  if (variant === "mobile") {
    return (
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 font-bold transition-colors hover:bg-red-50 hover:text-[#d71920] ${
            isActive ? "bg-blue-50 text-[#17245c] ring-1 ring-blue-100" : "text-[#17245c]"
          }`}
        >
          Categorías
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open ? (
          <div className="ml-3 space-y-0.5 border-l border-slate-200 pl-3">
            <button
              type="button"
              onClick={() => navigateToCategory()}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-red-50 hover:text-[#d71920] ${
                pathname === "/productos" && !activeSlug ? "text-[#17245c]" : "text-slate-600"
              }`}
            >
              Todos los productos
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => navigateToCategory(category.slug)}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-red-50 hover:text-[#d71920] ${
                  activeSlug === category.slug ? "text-[#17245c]" : "text-slate-600"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`relative inline-flex items-center gap-1 py-2 text-sm font-bold transition-colors hover:text-[#d71920] ${textClass} ${activeClass}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Categorías
        <ChevronDown
          className={`h-3.5 w-3.5 stroke-[3] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="absolute left-1/2 top-full z-50 mt-3 min-w-[220px] -translate-x-1/2 rounded-xl border border-slate-100 bg-white py-2 shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
          <button
            type="button"
            onClick={() => navigateToCategory()}
            className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-[#17245c] transition-colors hover:bg-red-50 hover:text-[#d71920]"
          >
            Todos los productos
          </button>
          {categories.length > 0 ? (
            <div className="my-1 border-t border-slate-100" />
          ) : null}
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => navigateToCategory(category.slug)}
              className={`block w-full px-4 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-red-50 hover:text-[#d71920] ${
                activeSlug === category.slug ? "bg-blue-50 text-[#17245c]" : "text-slate-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
