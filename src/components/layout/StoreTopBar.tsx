import { Headphones, MapPin, Phone, ShieldCheck, Truck } from "lucide-react";

const TOP_ITEMS = [
  { icon: Truck, label: "Envíos a todo el Perú" },
  { icon: ShieldCheck, label: "Asesoría técnica especializada" },
  { icon: Headphones, label: "Atención rápida y personalizada" },
];

export default function StoreTopBar() {
  return (
    <div className="hidden border-b border-white/10 bg-[#13154b] text-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 text-xs font-semibold sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-5">
          {TOP_ITEMS.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-2 text-white/90">
              <item.icon className="h-3.5 w-3.5 stroke-[2]" />
              {item.label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-5 text-white/90">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 stroke-[2]" />
            Lima, Perú
          </span>
          <a href="tel:+51936422757" className="inline-flex items-center gap-2 transition hover:text-white">
            <Phone className="h-3.5 w-3.5 stroke-[2]" />
            +51 936 422 757
          </a>
        </div>
      </div>
    </div>
  );
}
