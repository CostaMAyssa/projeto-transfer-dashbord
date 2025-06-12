import { Check } from "lucide-react"
import Image from "next/image"

interface PricingTableProps {
  language: string
}

export default function PricingTable({ language }: PricingTableProps) {
  const isPortuguese = language === "pt"
  const isSpanish = language === "es"

  const getLocalizedText = (pt: string, en: string, es: string) => {
    if (isPortuguese) return pt
    if (isSpanish) return es
    return en // default para inglês
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">
          {getLocalizedText("JFK ou LGA e NYC", "JFK or LGA and NYC", "JFK o LGA y NYC")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SUV */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-48 bg-gray-50">
              <Image
                src="https://content.app-sources.com/s/98064488125095989/uploads/Images/3_4-2598047.webp?format=webp"
                alt="SUV"
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="p-6">
              <h4 className="text-lg font-medium mb-1">SUV</h4>
              <p className="text-sm text-gray-500 mb-4">
                Chevrolet Suburban {getLocalizedText("ou similar", "or similar", "o similar")}
              </p>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">$160</span>
                <span className="text-gray-500 ml-1">{getLocalizedText("/viagem", "/trip", "/viaje")}</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-[#E95440] mr-2" />
                  <span className="text-sm">
                    {getLocalizedText("Até 6 passageiros", "Up to 6 passengers", "Hasta 6 pasajeros")}
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-[#E95440] mr-2" />
                  <span className="text-sm">
                    {getLocalizedText("Até 8 malas", "Up to 8 luggage items", "Hasta 8 maletas")}
                  </span>
                </li>
              </ul>
              <a
                href="https://customer.moovs.app/az-transfer/new/info?moovs_source=widget"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#E95440] text-white text-center py-2 rounded-md hover:bg-[#d64a36] transition-colors"
              >
                {getLocalizedText("Reservar Agora", "Book Now", "Reservar Ahora")}
              </a>
            </div>
          </div>

          {/* Minivan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-48 bg-gray-50">
              <Image
                src="https://content.app-sources.com/s/98064488125095989/uploads/Images/2_5-2598047.webp?format=webp"
                alt="Minivan"
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="p-6">
              <h4 className="text-lg font-medium mb-1">Minivan</h4>
              <p className="text-sm text-gray-500 mb-4">
                Chrysler Pacifica {getLocalizedText("ou similar", "or similar", "o similar")}
              </p>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">$150</span>
                <span className="text-gray-500 ml-1">{getLocalizedText("/viagem", "/trip", "/viaje")}</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-[#E95440] mr-2" />
                  <span className="text-sm">
                    {getLocalizedText("Até 7 passageiros", "Up to 7 passengers", "Hasta 7 pasajeros")}
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-[#E95440] mr-2" />
                  <span className="text-sm">
                    {getLocalizedText("Até 7 malas", "Up to 7 luggage items", "Hasta 7 maletas")}
                  </span>
                </li>
              </ul>
              <a
                href="https://customer.moovs.app/az-transfer/new/info?moovs_source=widget"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#E95440] text-white text-center py-2 rounded-md hover:bg-[#d64a36] transition-colors"
              >
                {getLocalizedText("Reservar Agora", "Book Now", "Reservar Ahora")}
              </a>
            </div>
          </div>

          {/* Sedan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-48 bg-gray-50">
              <Image
                src="https://content.app-sources.com/s/98064488125095989/uploads/Images/1_3-2598047.webp?format=webp"
                alt="Sedan"
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="p-6">
              <h4 className="text-lg font-medium mb-1">Sedan</h4>
              <p className="text-sm text-gray-500 mb-4">
                Toyota Camry {getLocalizedText("ou similar", "or similar", "o similar")}
              </p>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">$130</span>
                <span className="text-gray-500 ml-1">{getLocalizedText("/viagem", "/trip", "/viaje")}</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-[#E95440] mr-2" />
                  <span className="text-sm">
                    {getLocalizedText("Até 3 passageiros", "Up to 3 passengers", "Hasta 3 pasajeros")}
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-[#E95440] mr-2" />
                  <span className="text-sm">
                    {getLocalizedText("Até 4 malas", "Up to 4 luggage items", "Hasta 4 maletas")}
                  </span>
                </li>
              </ul>
              <a
                href="https://customer.moovs.app/az-transfer/new/info?moovs_source=widget"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#E95440] text-white text-center py-2 rounded-md hover:bg-[#d64a36] transition-colors"
              >
                {getLocalizedText("Reservar Agora", "Book Now", "Reservar Ahora")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">
          {getLocalizedText("EWR e Região", "EWR and Region", "EWR y Región")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SUV */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-48 bg-gray-50">
              <Image
                src="https://content.app-sources.com/s/98064488125095989/uploads/Images/3_4-2598047.webp?format=webp"
                alt="SUV"
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="p-6">
              <h4 className="text-lg font-medium mb-1">SUV</h4>
              <p className="text-sm text-gray-500 mb-4">
                Chevrolet Suburban {getLocalizedText("ou similar", "or similar", "o similar")}
              </p>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">$170</span>
                <span className="text-gray-500 ml-1">{getLocalizedText("/viagem", "/trip", "/viaje")}</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-[#E95440] mr-2" />
                  <span className="text-sm">
                    {getLocalizedText("Até 6 passageiros", "Up to 6 passengers", "Hasta 6 pasajeros")}
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-[#E95440] mr-2" />
                  <span className="text-sm">
                    {getLocalizedText("Até 8 malas", "Up to 8 luggage items", "Hasta 8 maletas")}
                  </span>
                </li>
              </ul>
              <a
                href="https://customer.moovs.app/az-transfer/new/info?moovs_source=widget"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#E95440] text-white text-center py-2 rounded-md hover:bg-[#d64a36] transition-colors"
              >
                {getLocalizedText("Reservar Agora", "Book Now", "Reservar Ahora")}
              </a>
            </div>
          </div>

          {/* Minivan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-48 bg-gray-50">
              <Image
                src="https://content.app-sources.com/s/98064488125095989/uploads/Images/2_5-2598047.webp?format=webp"
                alt="Minivan"
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="p-6">
              <h4 className="text-lg font-medium mb-1">Minivan</h4>
              <p className="text-sm text-gray-500 mb-4">
                Chrysler Pacifica {getLocalizedText("ou similar", "or similar", "o similar")}
              </p>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">$160</span>
                <span className="text-gray-500 ml-1">{getLocalizedText("/viagem", "/trip", "/viaje")}</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-[#E95440] mr-2" />
                  <span className="text-sm">
                    {getLocalizedText("Até 7 passageiros", "Up to 7 passengers", "Hasta 7 pasajeros")}
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-[#E95440] mr-2" />
                  <span className="text-sm">
                    {getLocalizedText("Até 7 malas", "Up to 7 luggage items", "Hasta 7 maletas")}
                  </span>
                </li>
              </ul>
              <a
                href="https://customer.moovs.app/az-transfer/new/info?moovs_source=widget"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#E95440] text-white text-center py-2 rounded-md hover:bg-[#d64a36] transition-colors"
              >
                {getLocalizedText("Reservar Agora", "Book Now", "Reservar Ahora")}
              </a>
            </div>
          </div>

          {/* Sedan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-48 bg-gray-50">
              <Image
                src="https://content.app-sources.com/s/98064488125095989/uploads/Images/1_3-2598047.webp?format=webp"
                alt="Sedan"
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="p-6">
              <h4 className="text-lg font-medium mb-1">Sedan</h4>
              <p className="text-sm text-gray-500 mb-4">
                Toyota Camry {getLocalizedText("ou similar", "or similar", "o similar")}
              </p>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">$140</span>
                <span className="text-gray-500 ml-1">{getLocalizedText("/viagem", "/trip", "/viaje")}</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-[#E95440] mr-2" />
                  <span className="text-sm">
                    {getLocalizedText("Até 3 passageiros", "Up to 3 passengers", "Hasta 3 pasajeros")}
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-[#E95440] mr-2" />
                  <span className="text-sm">
                    {getLocalizedText("Até 4 malas", "Up to 4 luggage items", "Hasta 4 maletas")}
                  </span>
                </li>
              </ul>
              <a
                href="https://customer.moovs.app/az-transfer/new/info?moovs_source=widget"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#E95440] text-white text-center py-2 rounded-md hover:bg-[#d64a36] transition-colors"
              >
                {getLocalizedText("Reservar Agora", "Book Now", "Reservar Ahora")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          {getLocalizedText(
            "* Preços sujeitos a alterações. Taxas adicionais podem ser aplicadas para viagens em horários de pico, feriados ou condições especiais.",
            "* Prices subject to change. Additional fees may apply for peak hours, holidays, or special conditions.",
            "* Precios sujetos a cambios. Se pueden aplicar tarifas adicionales para horas pico, días festivos o condiciones especiales.",
          )}
        </p>
      </div>
    </div>
  )
}
