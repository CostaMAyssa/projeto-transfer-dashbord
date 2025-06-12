import { User, Briefcase } from "lucide-react"
import Image from "next/image"

interface VehicleCardProps {
  title: string
  description: string
  imageSrc: string
  passengers: number
  luggage: number
}

export default function VehicleCard({ title, description, imageSrc, passengers, luggage }: VehicleCardProps) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h3 className="text-2xl font-medium text-[#181A1F] mb-2">{title}</h3>
      <p className="text-base text-[#181A1F]/70 mb-6">{description}</p>

      <div className="relative w-full h-48 mb-8">
        <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="object-contain" />
      </div>

      <div className="flex justify-between">
        <div className="flex items-center gap-3 bg-gray-100 px-5 py-3 rounded-full">
          <User className="w-5 h-5 text-[#181A1F]" />
          <span className="text-base font-medium">Passengers {passengers}</span>
        </div>
        <div className="flex items-center gap-3 bg-gray-100 px-5 py-3 rounded-full">
          <Briefcase className="w-5 h-5 text-[#181A1F]" />
          <span className="text-base font-medium">Luggage {luggage}</span>
        </div>
      </div>
    </div>
  )
}
