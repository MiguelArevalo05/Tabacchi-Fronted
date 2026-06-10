import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grupo Tabacchi | Fumigación y Control de Plagas",
  description:
    "Especialistas en fumigación, control de plagas, desinfección y limpieza de tanques en Perú. Soluciones seguras con normas técnicas peruanas.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
