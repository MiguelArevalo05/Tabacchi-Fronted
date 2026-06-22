import type React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen grid bg-white md:grid-cols-2">
      {/* Panel izquierdo — branding */}
      <div className="relative hidden min-h-screen overflow-hidden bg-[#061733] md:block">
        <Image
          src="/images/login1.png"
          alt="Grupo Tabacchi"
          fill
          priority
          className="object-contain"
          sizes="50vw"
        />
      </div>

      {/* Panel derecho — formulario */}
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6 sm:p-10">
        <div
          className="pointer-events-none absolute bottom-0 right-0 w-48 h-48 opacity-20"
          aria-hidden
        >
          <div className="absolute bottom-0 right-0 w-full h-3 bg-red-600 rotate-[-35deg] origin-bottom-right translate-y-2" />
          <div className="absolute bottom-4 right-0 w-full h-3 bg-yellow-400 rotate-[-35deg] origin-bottom-right" />
          <div className="absolute bottom-8 right-0 w-full h-3 bg-blue-700 rotate-[-35deg] origin-bottom-right -translate-y-2" />
        </div>

        <div className="relative z-10 w-full max-w-md md:max-w-lg lg:max-w-xl">
          {/* Logo móvil — aumentado de h-16 a h-24 */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/images/logo-tabacchi.png"
              alt="Grupo Tabacchi"
              width={240}
              height={132}
              className="h-24 w-auto object-contain"
              priority
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 px-8 py-9 sm:px-10 sm:py-10">
            {/* Logo desktop — aumentado de h-20 a h-28 */}
            <div className="hidden lg:flex justify-center mb-6">
              <Image
                src="/images/logo-tabacchi.png"
                alt="Grupo Tabacchi"
                width={280}
                height={154}
                className="h-28 w-auto object-contain"
                priority
              />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#001a3a]">
                Bienvenido de nuevo
              </h2>
              <div className="mx-auto mt-2 mb-3 h-0.5 w-10 bg-red-600 rounded-full" />
              <p className="text-sm text-slate-500">
                Inicia sesión para continuar
              </p>
            </div>
            {children}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            © {new Date().getFullYear()} Grupo Tabacchi. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;