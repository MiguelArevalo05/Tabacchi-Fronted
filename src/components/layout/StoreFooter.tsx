import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

import StoreCategoryLinks from "@/components/layout/StoreCategoryLinks";

const FOOTER_LINKS = [
  { href: "/landing#inicio", label: "Inicio" },
  { href: "/landing#productos", label: "Productos" },
  { href: "/productos", label: "Catálogo" },
  { href: "/landing#servicios", label: "Servicios" },
  { href: "/landing#nosotros", label: "Nosotros" },
  { href: "/landing#certificaciones", label: "Certificaciones" },
  { href: "/landing#contacto", label: "Contacto" },
];

function LogoMark({ className = "h-16 w-56" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/images/logo-footer.png"
        alt="Grupo Tabacchi"
        fill
        sizes="224px"
        className="object-contain object-left"
      />
    </div>
  );
}

export default function StoreFooter() {
  return (
    <footer className="bg-[#13154b] text-blue-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b border-white/10 pb-7 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_0.9fr_1.25fr] lg:divide-x lg:divide-white/10">
          <div className="lg:pr-8">
            <LogoMark className="h-20 w-72" />
            <div className="mt-5 flex gap-4">
              {[
                { label: "Facebook", icon: FaFacebookF },
                { label: "Instagram", icon: FaInstagram },
                { label: "WhatsApp", icon: FaWhatsapp },
                { label: "LinkedIn", icon: FaLinkedinIn },
              ].map((item) => (
                <a
                  key={item.label}
                  href="/landing#contacto"
                  aria-label={item.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white hover:text-blue-950"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:px-8">
            <h3 className="text-sm font-black text-white">Enlaces</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm font-medium text-blue-100/80">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:px-8">
            <h3 className="text-sm font-black text-white">Categorías</h3>
            <ul className="mt-4 space-y-3 text-sm font-medium text-blue-100/80">
              <StoreCategoryLinks />
            </ul>
          </div>

          <div className="lg:pl-8">
            <h3 className="text-sm font-black text-white">Contáctanos</h3>
            <ul className="mt-4 space-y-4 text-sm font-medium text-blue-100/80">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white" />
                +51 936 422 757
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white" />
                ventas@grupotabacchi.com
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-white" />
                Lima, Perú
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-5 text-center text-sm text-blue-100/70">
          © 2024 Grupo Tabacchi. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
