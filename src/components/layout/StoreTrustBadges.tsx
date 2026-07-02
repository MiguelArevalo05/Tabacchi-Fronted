import { BadgeCheck, Headphones, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Envíos a todo el Perú",
    description: "Llegamos a cualquier parte del país.",
  },
  {
    icon: BadgeCheck,
    title: "Productos certificados",
    description: "Cumplimos con normas nacionales e internacionales.",
  },
  {
    icon: ShieldCheck,
    title: "Garantía de satisfacción",
    description: "Productos de calidad con garantía asegurada.",
  },
  {
    icon: Headphones,
    title: "Asesoría técnica especializada",
    description: "Te ayudamos a elegir el producto ideal para ti.",
  },
  {
    icon: ShoppingBag,
    title: "Compra segura",
    description: "Tus compras están protegidas con encriptación SSL.",
  },
];

export default function StoreTrustBadges() {
  return (
    <section className="border-t border-slate-200 bg-[#f8fafc] py-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:gap-6 lg:px-8">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[#17245c]">
              <item.icon className="h-5 w-5 stroke-[1.8]" />
            </span>
            <div>
              <p className="text-sm font-bold leading-5 text-[#17245c]">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
