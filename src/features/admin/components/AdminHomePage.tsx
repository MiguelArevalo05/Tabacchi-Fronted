import Link from "next/link";
import {
  Package,
  Wrench,
  ShoppingBag,
  ExternalLink,
  Users,
  ArrowRight,
} from "lucide-react";

const quickLinks = [
  {
    href: "/admin/productos",
    label: "Productos",
    desc: "Gestiona el catálogo de la tienda",
    icon: Package,
    color: "from-blue-600 to-blue-700",
  },
  {
    href: "/admin/servicios",
    label: "Servicios",
    desc: "Servicios visibles en la landing",
    icon: Wrench,
    color: "from-indigo-600 to-indigo-700",
  },
  {
    href: "/admin/ordenes",
    label: "Órdenes",
    desc: "Pedidos y estados de clientes",
    icon: ShoppingBag,
    color: "from-violet-600 to-violet-700",
  },
  {
    href: "/admin/usuarios",
    label: "Usuarios",
    desc: "Cuentas y accesos al sistema",
    icon: Users,
    color: "from-slate-700 to-slate-800",
  },
];

export default function MainPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Bienvenido al panel
        </h1>
        <p className="text-slate-600 mt-2 max-w-xl">
          Administra la tienda de Grupo Tabacchi: productos, servicios, órdenes
          y usuarios desde un solo lugar.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md shrink-0`}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{item.label}</p>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/landing"
        target="_blank"
        className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors shadow-sm"
      >
        <ExternalLink className="w-4 h-4" />
        Abrir tienda pública
      </Link>
    </div>
  );
}
