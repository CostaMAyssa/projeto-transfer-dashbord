import { getDictionary } from "./dictionaries"
import dynamic from "next/dynamic"
import type { Metadata } from "next"
import Image from "next/image"
import { Shield, MapPin, PlaneTakeoff, CheckCircle, Star } from "lucide-react"
import ServiceAreaClient from "@/components/service-area-client"
import PricingTable from "@/components/pricing-table"
import TestimonialGallery from "@/components/testimonial-gallery"

// Importar componentes com lazy loading para evitar problemas de suspensão
const LanguageSwitcher = dynamic(() => import("@/components/language-switcher"), {
  ssr: true,
  loading: () => <div className="w-10 h-10 rounded-full bg-gray-100"></div>,
})

const VehicleCarousel = dynamic(() => import("@/components/vehicle-carousel"), {
  ssr: true,
  loading: () => <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse"></div>,
})

const AnimateOnScroll = dynamic(() => import("@/components/animate-on-scroll"), {
  ssr: true,
})

export const metadata: Metadata = {
  title: "AZ Transfer | Executive Transportation",
  description: "Premium transportation services in New York with verified drivers and trackable vehicles",
}

// Função para obter o texto baseado no idioma
const getLocalizedText = (lang: string, pt: string, en: string, es: string) => {
  if (lang === "pt") return pt
  if (lang === "es") return es
  return en // default para inglês
}

export default async function Home({
  params,
}: {
  params: { lang: string }
}) {
  const dict = await getDictionary(params.lang)

  return (
    <main className="flex min-h-screen flex-col items-center bg-white text-[#181A1F] relative overflow-hidden">
      {/* Header - Minimal with just logo and controls */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="relative w-[100px] sm:w-[120px] h-8 sm:h-10">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AZ_Transfer_Logo-2114669%20%281%29-B2wSNbPiBfGCv1l8HXV55FJExLAfx1.webp"
              alt="AZ Transfer Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <LanguageSwitcher currentLang={params.lang} />
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="w-full relative">
        <div className="relative h-[70vh] md:h-[90vh] w-full">
          <Image
            src="https://luxride.themepanthers.com/lux/wp-content/uploads/2024/04/news6.jpg"
            alt="Executive Transportation"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 flex flex-col justify-center items-center px-4 md:px-20">
            <div className="max-w-4xl mx-auto text-center">
              {/* Trust Badge */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 border border-white/20 fade-in">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#E95440] mr-1 sm:mr-2" fill="#E95440" />
                <span className="text-white text-xs sm:text-sm font-medium">
                  {getLocalizedText(
                    params.lang,
                    "Avaliação 4.95/5 - Mais de 10.000 clientes satisfeitos",
                    "Rating 4.95/5 - Over 10,000 satisfied customers",
                    "Calificación 4.95/5 - Más de 10.000 clientes satisfechos",
                  )}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-dm-sans font-light text-white mb-4 sm:mb-6 leading-tight slide-up">
                {getLocalizedText(
                  params.lang,
                  "Transporte Executivo com Segurança e Elegância",
                  "Executive Transportation with Safety and Elegance",
                  "Transporte Ejecutivo con Seguridad y Elegancia",
                )}
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl md:text-2xl font-dm-sans font-light text-white/90 mb-6 sm:mb-8 slide-up">
                {getLocalizedText(
                  params.lang,
                  "Viaje com conforto e tranquilidade em Nova York com motoristas verificados e veículos premium rastreáveis",
                  "Travel with comfort and peace of mind in New York with verified drivers and trackable premium vehicles",
                  "Viaje con comodidad y tranquilidad en Nueva York con conductores verificados y vehículos premium rastreables",
                )}
              </p>

              {/* Key Benefits */}
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 md:gap-8 mb-6 sm:mb-10 slide-up">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#E95440] mr-1 sm:mr-2" />
                  <span className="text-white text-xs sm:text-sm md:text-base">
                    {getLocalizedText(
                      params.lang,
                      "Motoristas Verificados",
                      "Verified Drivers",
                      "Conductores Verificados",
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#E95440] mr-1 sm:mr-2" />
                  <span className="text-white text-xs sm:text-sm md:text-base">
                    {getLocalizedText(
                      params.lang,
                      "Veículos Rastreáveis",
                      "Trackable Vehicles",
                      "Vehículos Rastreables",
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#E95440] mr-1 sm:mr-2" />
                  <span className="text-white text-xs sm:text-sm md:text-base">
                    {getLocalizedText(params.lang, "Suporte 24/7", "24/7 Support", "Soporte 24/7")}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 slide-up">
                <a
                  href="https://customer.moovs.app/az-transfer/new/info?moovs_source=widget"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-block bg-[#E95440] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-sm sm:text-lg font-medium hover:bg-[#d64a36] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {getLocalizedText(
                    params.lang,
                    "AGENDAR TRANSFER AGORA",
                    "BOOK TRANSFER NOW",
                    "RESERVAR TRANSFER AHORA",
                  )}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        {/* Features Section */}
        <section className="py-10 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              <AnimateOnScroll animation="fade-up" delay={0}>
                <div className="text-center">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-[#E95440]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4 text-gray-800">
                    {getLocalizedText(params.lang, "Segurança em Primeiro Lugar", "Safety First", "Seguridad Primero")}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {getLocalizedText(
                      params.lang,
                      "Tanto você quanto suas bagagens viajarão com motoristas profissionais. Sempre com os mais altos padrões de qualidade.",
                      "Both you and your shipments will travel with professional drivers. Always with the highest quality standards.",
                      "Tanto usted como su equipaje viajarán con conductores profesionales. Siempre con los más altos estándares de calidad.",
                    )}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll animation="fade-up" delay={200}>
                <div className="text-center">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-[#E95440]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4 text-gray-800">
                    {getLocalizedText(
                      params.lang,
                      "Preços Sem Surpresas",
                      "Prices With No Surprises",
                      "Precios Sin Sorpresas",
                    )}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {getLocalizedText(
                      params.lang,
                      "Tanto você quanto suas bagagens viajarão com motoristas profissionais. Sempre com os mais altos padrões de qualidade.",
                      "Both you and your shipments will travel with professional drivers. Always with the highest quality standards.",
                      "Tanto usted como su equipaje viajarán con conductores profesionales. Siempre con los más altos estándares de calidad.",
                    )}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll animation="fade-up" delay={400}>
                <div className="text-center">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <PlaneTakeoff className="w-10 h-10 sm:w-12 sm:h-12 text-[#E95440]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4 text-gray-800">
                    {getLocalizedText(
                      params.lang,
                      "Soluções de Viagem Privadas",
                      "Private Travel Solutions",
                      "Soluciones de Viaje Privadas",
                    )}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {getLocalizedText(
                      params.lang,
                      "Tanto você quanto suas bagagens viajarão com motoristas profissionais. Sempre com os mais altos padrões de qualidade.",
                      "Both you and your shipments will travel with professional drivers. Always with the highest quality standards.",
                      "Tanto usted como su equipaje viajarán con conductores profesionales. Siempre con los más altos estándares de calidad.",
                    )}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white rounded-xl mb-20">
          <div className="max-w-7xl mx-auto px-4">
            <AnimateOnScroll animation="fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-dm-sans text-gray-800 mb-2">
                  {getLocalizedText(
                    params.lang,
                    "Clientes que Confiam em Nós",
                    "Clients Who Trust Us",
                    "Clientes que Confían en Nosotros",
                  )}
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  {getLocalizedText(
                    params.lang,
                    "Personalidades que escolheram nosso serviço de transporte executivo em Nova York",
                    "Personalities who chose our executive transportation service in New York",
                    "Personalidades que eligieron nuestro servicio de transporte ejecutivo en Nueva York",
                  )}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up">
              <TestimonialGallery language={params.lang} />
            </AnimateOnScroll>
          </div>
        </section>

        {/* Fleet Section */}
        <section id="fleet" className="py-20 bg-gray-50 rounded-xl">
          <div className="max-w-7xl mx-auto px-4">
            <AnimateOnScroll animation="fade-in">
              <div className="mb-12">
                <h2 className="text-3xl font-dm-sans text-gray-800">{dict.fleetTitle}</h2>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up">
              <VehicleCarousel vehicles={dict.vehicles} />
            </AnimateOnScroll>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gray-50 rounded-xl mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <AnimateOnScroll animation="fade-in">
              <div className="mb-12">
                <h2 className="text-3xl font-dm-sans text-gray-800 mb-4">
                  {getLocalizedText(params.lang, "Nossos Preços", "Our Prices", "Nuestros Precios")}
                </h2>
                <p className="text-gray-600 max-w-3xl">
                  {getLocalizedText(
                    params.lang,
                    "Oferecemos preços transparentes e competitivos para todos os nossos serviços de transporte executivo. Sem taxas ocultas ou surpresas.",
                    "We offer transparent and competitive prices for all our executive transportation services. No hidden fees or surprises.",
                    "Ofrecemos precios transparentes y competitivos para todos nuestros servicios de transporte ejecutivo. Sin tarifas ocultas ni sorpresas.",
                  )}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up">
              <PricingTable language={params.lang} />
            </AnimateOnScroll>
          </div>
        </section>

        {/* Service Area Map Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <AnimateOnScroll animation="fade-in">
              <div className="mb-12">
                <h2 className="text-3xl font-dm-sans text-gray-800 mb-4">
                  {getLocalizedText(
                    params.lang,
                    "Nossa Área de Atuação",
                    "Our Service Area",
                    "Nuestra Área de Servicio",
                  )}
                </h2>
                <p className="text-gray-600 max-w-3xl">
                  {getLocalizedText(
                    params.lang,
                    "Oferecemos serviços de transporte executivo em toda a região metropolitana de Nova York, incluindo Manhattan, Brooklyn, Queens, Bronx, Staten Island, Long Island, e áreas de Nova Jersey e Connecticut.",
                    "We offer executive transportation services throughout the New York metropolitan area, including Manhattan, Brooklyn, Queens, Bronx, Staten Island, Long Island, and areas of New Jersey and Connecticut.",
                    "Ofrecemos servicios de transporte ejecutivo en toda el área metropolitana de Nueva York, incluyendo Manhattan, Brooklyn, Queens, Bronx, Staten Island, Long Island y áreas de Nueva Jersey y Connecticut.",
                  )}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="zoom-in">
              <ServiceAreaClient language={params.lang} />
            </AnimateOnScroll>

            <div className="mt-8 text-sm text-gray-500 text-center">
              {getLocalizedText(
                params.lang,
                "* Áreas adicionais podem ser atendidas mediante solicitação prévia.",
                "* Additional areas may be served upon prior request.",
                "* Se pueden atender áreas adicionales previa solicitud.",
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black text-white rounded-2xl p-6 sm:p-16 text-center my-8 sm:my-12 relative overflow-hidden">
          {/* Background overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/70 z-10"></div>

          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://luxride.themepanthers.com/lux/wp-content/uploads/2024/04/news6.jpg"
              alt="Luxury Transportation"
              fill
              className="object-cover opacity-40"
              sizes="100vw"
            />
          </div>

          <AnimateOnScroll animation="fade-up" className="relative z-20 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-dm-sans font-light mb-4 sm:mb-6">
              {getLocalizedText(
                params.lang,
                "Pronto para viajar com segurança e conforto?",
                "Ready to travel with safety and comfort?",
                "¿Listo para viajar con seguridad y comodidad?",
              )}
            </h2>
            <p className="text-base sm:text-xl text-white/80 max-w-2xl mx-auto mb-6 sm:mb-10">
              {getLocalizedText(
                params.lang,
                "Reserve seu transfer premium agora e desfrute de uma experiência de viagem exclusiva com motoristas verificados e veículos de luxo.",
                "Book your premium transfer now and enjoy an exclusive travel experience with verified drivers and luxury vehicles.",
                "Reserve su transfer premium ahora y disfrute de una experiencia de viaje exclusiva con conductores verificados y vehículos de lujo.",
              )}
            </p>
            <a
              href="https://customer.moovs.app/az-transfer/new/info?moovs_source=widget"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#E95440] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-sm sm:text-lg font-medium hover:bg-[#d64a36] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {getLocalizedText(params.lang, "AGENDAR TRANSFER AGORA", "BOOK TRANSFER NOW", "RESERVAR TRANSFER AHORA")}
            </a>
          </AnimateOnScroll>
        </section>
      </div>

      {/* Enhanced Footer */}
      <footer className="w-full bg-white border-t border-gray-100 pt-10 sm:pt-16 pb-6 sm:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Top Section with Logo and Links */}
          <AnimateOnScroll animation="fade-up">
            <div className="flex flex-col justify-center items-center mb-8 sm:mb-12">
              {/* Logo and Tagline */}
              <div className="mb-6 sm:mb-10 text-center">
                <div className="relative w-[140px] sm:w-[180px] h-10 sm:h-14 mx-auto mb-3 sm:mb-4">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AZ_Transfer_Logo-2114669%20%281%29-B2wSNbPiBfGCv1l8HXV55FJExLAfx1.webp"
                    alt="AZ Transfer Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                  {getLocalizedText(
                    params.lang,
                    "Serviços de transporte executivo premium em Nova York.",
                    "Premium executive transportation services in New York.",
                    "Servicios premium de transporte ejecutivo en Nueva York.",
                  )}
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Divider */}
          <div className="h-px bg-gray-200 w-full my-6 sm:my-8"></div>

          {/* Bottom Section with Social and Copyright */}
          <div className="flex justify-center items-center">
            <p className="text-xs sm:text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} AZ Transfer.{" "}
              {getLocalizedText(
                params.lang,
                "Todos os direitos reservados.",
                "All rights reserved.",
                "Todos los derechos reservados.",
              )}
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export async function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }, { lang: "es" }]
}
