import { getDictionary } from "./dictionaries"
import LanguageSwitcher from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Metadata } from "next"
import Image from "next/image"
import { Shield, MapPin, Clock, PlaneTakeoff, ChevronRight, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "AZ Transfer | Premium Transportation",
  description: "Book your premium transportation service with verified drivers and trackable vehicles",
}

export default async function LandingPage({
  params,
}: {
  params: { lang: string }
}) {
  const dict = await getDictionary(params.lang)

  return (
    <main className="flex min-h-screen flex-col items-center bg-white text-[#181A1F] relative overflow-hidden">
      {/* Header - Minimal with just logo and language switcher */}
      <header className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="relative w-[100px] h-8">
            <Image
              src="/img/logo.png"
              alt="AZ Transfer Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher currentLang={params.lang} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full relative">
        <div className="relative h-[60vh] md:h-[80vh] w-full">
          <Image
            src="https://content.app-sources.com/s/98064488125095989/uploads/Images/woman-traveling-2598047.webp"
            alt="Executive Transportation"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center md:items-start px-4 md:px-20">
            <div className="max-w-3xl text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {params.lang === "pt" ? "Viaje com Segurança e Conforto" : "Travel with Safety and Comfort"}
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8">
                {params.lang === "pt"
                  ? "Motoristas Verificados e Veículos Rastreáveis"
                  : "Verified Drivers and Trackable Vehicles"}
              </p>
              <a
                href="https://customer.moovs.app/az-transfer/new/info?moovs_source=widget"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#E95440] text-white px-8 py-4 rounded text-lg font-medium hover:bg-[#d64a36] transition-colors"
              >
                {params.lang === "pt" ? "AGENDAR AGORA" : "BOOK NOW"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 py-16">
        {/* Value Proposition */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {params.lang === "pt" ? "Por Que Escolher AZ Transfer?" : "Why Choose AZ Transfer?"}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {params.lang === "pt"
                ? "Oferecemos serviços de transporte premium com foco em segurança, conforto e confiabilidade para sua tranquilidade."
                : "We offer premium transportation services focused on safety, comfort, and reliability for your peace of mind."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-[#E95440]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-[#E95440]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {params.lang === "pt" ? "Motoristas Verificados" : "Verified Drivers"}
              </h3>
              <p className="text-gray-600">
                {params.lang === "pt"
                  ? "Todos os nossos motoristas são treinados, cadastrados e passam por verificação de antecedentes."
                  : "All our drivers are trained, registered, and undergo background checks."}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-[#E95440]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-[#E95440]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {params.lang === "pt" ? "Veículos Rastreáveis" : "Trackable Vehicles"}
              </h3>
              <p className="text-gray-600">
                {params.lang === "pt"
                  ? "Acompanhe seu trajeto em tempo real através do nosso aplicativo, compartilhe sua localização."
                  : "Track your journey in real-time through our app, share your location with friends or family."}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-[#E95440]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-[#E95440]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {params.lang === "pt" ? "Atendimento 24h" : "24/7 Support"}
              </h3>
              <p className="text-gray-600">
                {params.lang === "pt"
                  ? "Suporte imediato para emergências e dúvidas a qualquer hora do dia ou da noite."
                  : "Immediate support for emergencies and questions at any time of day or night."}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-[#E95440]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <PlaneTakeoff className="w-8 h-8 text-[#E95440]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {params.lang === "pt" ? "Monitoramento de Voos" : "Flight Monitoring"}
              </h3>
              <p className="text-gray-600">
                {params.lang === "pt"
                  ? "Acompanhamos o status do seu voo para evitar atrasos e cancelamentos inesperados."
                  : "We monitor your flight status to avoid unexpected delays and cancellations."}
              </p>
            </div>
          </div>
        </section>

        {/* Vehicle Showcase */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {params.lang === "pt" ? "Nossa Frota Premium" : "Our Premium Fleet"}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {params.lang === "pt"
                ? "Escolha o veículo perfeito para sua necessidade, todos com o máximo de conforto e segurança."
                : "Choose the perfect vehicle for your needs, all with maximum comfort and safety."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vehicle 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all">
              <div className="relative h-48 bg-gray-50">
                <img
                  src="https://content.app-sources.com/s/98064488125095989/uploads/Images/3_4-2598047.webp?format=webp"
                  alt="SUV"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold">SUV</h3>
                  <div className="text-[#E95440] font-medium">Premium</div>
                </div>
                <p className="text-gray-600 mb-6">
                  {params.lang === "pt" ? "Chevrolet Suburban ou similar" : "Chevrolet Suburban or similar"}
                </p>
                <a
                  href="https://customer.moovs.app/az-transfer/new/info?moovs_source=widget"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-black text-white rounded-md py-3 font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  {params.lang === "pt" ? "Agendar agora" : "Book now"}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Vehicle 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all">
              <div className="relative h-48 bg-gray-50">
                <img
                  src="https://content.app-sources.com/s/98064488125095989/uploads/Images/2_5-2598047.webp?format=webp"
                  alt="Mini Van"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold">Mini Van</h3>
                  <div className="text-[#E95440] font-medium">Premium</div>
                </div>
                <p className="text-gray-600 mb-6">
                  {params.lang === "pt" ? "Chrysler Pacifica ou similar" : "Chrysler Pacifica or similar"}
                </p>
                <a
                  href="https://customer.moovs.app/az-transfer/new/info?moovs_source=widget"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-black text-white rounded-md py-3 font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  {params.lang === "pt" ? "Agendar agora" : "Book now"}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Vehicle 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all">
              <div className="relative h-48 bg-gray-50">
                <img
                  src="https://content.app-sources.com/s/98064488125095989/uploads/Images/1_3-2598047.webp?format=webp"
                  alt="Sedan"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold">Sedan</h3>
                  <div className="text-[#E95440] font-medium">Premium</div>
                </div>
                <p className="text-gray-600 mb-6">
                  {params.lang === "pt" ? "Toyota Camry ou similar" : "Toyota Camry or similar"}
                </p>
                <a
                  href="https://customer.moovs.app/az-transfer/new/info?moovs_source=widget"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-black text-white rounded-md py-3 font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  {params.lang === "pt" ? "Agendar agora" : "Book now"}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {params.lang === "pt" ? "O Que Nossos Clientes Dizem" : "What Our Clients Say"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <span className="text-[#E95440] font-medium">MR</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Maria R.</h3>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-[#E95440] fill-[#E95440]" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                {params.lang === "pt"
                  ? '"Como mulher que viaja sozinha frequentemente, a segurança é minha prioridade. Com a AZ Transfer, me sinto tranquila sabendo que posso rastrear o veículo e que os motoristas são verificados."'
                  : '"As a woman who travels alone frequently, safety is my priority. With AZ Transfer, I feel at ease knowing I can track the vehicle and that the drivers are verified."'}
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <span className="text-[#E95440] font-medium">CS</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Carolina S.</h3>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-[#E95440] fill-[#E95440]" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                {params.lang === "pt"
                  ? '"O atendimento 24h foi fundamental quando meu voo atrasou. A equipe ajustou meu transfer imediatamente e me manteve informada o tempo todo. Serviço impecável!"'
                  : '"The 24/7 support was essential when my flight was delayed. The team adjusted my transfer immediately and kept me informed the whole time. Impeccable service!"'}
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{params.lang === "pt" ? "Como Funciona" : "How It Works"}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E95440] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {params.lang === "pt" ? "Faça sua reserva" : "Make your booking"}
              </h3>
              <p className="text-gray-600">
                {params.lang === "pt"
                  ? "Escolha seu veículo e informe os detalhes da sua viagem através do nosso sistema de reservas online."
                  : "Choose your vehicle and provide your trip details through our online booking system."}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#E95440] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {params.lang === "pt" ? "Receba a confirmação" : "Receive confirmation"}
              </h3>
              <p className="text-gray-600">
                {params.lang === "pt"
                  ? "Você receberá uma confirmação imediata com todos os detalhes do seu transfer e informações do motorista."
                  : "You'll receive immediate confirmation with all your transfer details and driver information."}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#E95440] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {params.lang === "pt" ? "Aproveite sua viagem" : "Enjoy your ride"}
              </h3>
              <p className="text-gray-600">
                {params.lang === "pt"
                  ? "Nosso motorista profissional estará esperando por você no local combinado para uma viagem confortável e segura."
                  : "Our professional driver will be waiting for you at the agreed location for a comfortable and safe journey."}
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gray-100 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {params.lang === "pt"
              ? "Pronto para viajar com segurança e conforto?"
              : "Ready to travel with safety and comfort?"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            {params.lang === "pt"
              ? "Reserve seu transfer premium agora e garanta uma experiência de viagem tranquila e confortável."
              : "Book your premium transfer now and ensure a smooth and comfortable travel experience."}
          </p>
          <a
            href="https://customer.moovs.app/az-transfer/new/info?moovs_source=widget"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#E95440] text-white px-8 py-4 rounded text-lg font-medium hover:bg-[#d64a36] transition-colors"
          >
            {params.lang === "pt" ? "AGENDAR AGORA" : "BOOK NOW"}
          </a>
        </section>
      </div>

      {/* Footer - Minimal */}
      <footer className="w-full bg-white border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="relative w-[100px] h-8 mx-auto mb-4">
            <Image
              src="/img/logo.png"
              alt="AZ Transfer Logo"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AZ Transfer.{" "}
            {params.lang === "pt" ? "Todos os direitos reservados." : "All rights reserved."}
          </p>
        </div>
      </footer>
    </main>
  )
}

export async function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }]
}
