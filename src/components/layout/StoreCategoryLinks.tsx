"use client";

import Link from "next/link";

import { useCategories } from "@/features/categories/hooks/useCategories";

export default function StoreCategoryLinks() {
  const { data: categoriesResponse } = useCategories({ limit: 20 });
  const categories = categoriesResponse?.data ?? [];

  if (categories.length === 0) {
    return (
      <li>
        <Link href="/productos" className="transition hover:text-white">
          Ver catálogo
        </Link>
      </li>
    );
  }

  return (
    <>
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={`/productos?categoria=${category.slug}`}
            className="transition hover:text-white"
          >
            {category.name}
          </Link>
        </li>
      ))}
    </>
  );
}
