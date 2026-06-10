import type React from "react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const carouselImages = [
    {
      src: "/images/carrusel-1.webp",
      alt: "Comprometidos con el Trabajo en Equipo",
    },
    {
      src: "/images/carrusel-2.webp",
      alt: "Construyendo el futuro con excelencia e innovación",
    },
    {
      src: "/images/carrusel-3.webp",
      alt: "Excelencia en cada servicio",
    },
    {
      src: "/images/carrusel-4.webp",
      alt: "Comprometidos con el medio ambiente",
    },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Sección izquierda (formulario de login) */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <Image
                src="/images/taba2.png"
                alt="Logo de la empresa"
                width={400}
                height={400}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Bienvenido
            </h1>
            <p className="text-slate-600">Inicia sesión en tu cuenta</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
            {children}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-8">
            © 2026 Grupo Tabacchi. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Sección derecha (carrusel con imágenes) */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-600 to-slate-800 p-12 relative overflow-hidden">
        {/* Efectos decorativos */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-700/20 rounded-full blur-3xl" />

        {/* Carrusel principal */}
        <div className="relative z-10 w-full max-w-6xl">
          <div className="w-[95%] mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                }),
              ]}
            >
              <CarouselContent>
                {carouselImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl max-h-[650px]">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="w-full h-full object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                        <h3 className="text-white text-lg sm:text-2xl font-semibold mb-1 sm:mb-2">
                          {image.alt}
                        </h3>
                        <p className="text-white/80 text-sm sm:text-base">
                          Grupo Tabacchi S.A.C.
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-4 bg-white/10 border-white/20 text-white hover:bg-white/20" />
              <CarouselNext className="right-4 bg-white/10 border-white/20 text-white hover:bg-white/20" />
            </Carousel>
          </div>

          {/* Información adicional */}
          <div className="mt-12 text-center">
            <p className="text-white/90 text-3xl font-bold mb-4">
              100+ Servicios Realizados con Éxito
            </p>

            <p className="text-white/80 text-lg leading-relaxed max-w-4xl mx-auto">
              Especialistas en fumigación, control de plagas, desinfección y
              limpieza de tanques. Brindamos soluciones seguras y efectivas
              cumpliendo con los estándares y normas técnicas peruanas para
              garantizar la protección de hogares, empresas e industrias.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <h3 className="text-yellow-400 text-2xl font-bold">100%</h3>
                <p className="text-white/70 text-sm">Seguridad Garantizada</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <h3 className="text-yellow-400 text-2xl font-bold">24/7</h3>
                <p className="text-white/70 text-sm">Atención Rápida</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <h3 className="text-yellow-400 text-2xl font-bold">Cert.</h3>
                <p className="text-white/70 text-sm">Normas Técnicas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
