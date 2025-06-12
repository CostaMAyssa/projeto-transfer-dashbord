import {
  ChevronRight,
  MapPin,
  Calendar,
  Phone,
  MessageSquare,
  Star,
  FileText,
  Smartphone,
  Shield,
  Gift,
  Users,
} from "lucide-react"

interface Link {
  title: string
  url: string
  description?: string
  image?: string
  icon: string
  featured?: boolean
}

interface LinkTreeProps {
  links: Link[]
}

export default function LinkTree({ links }: LinkTreeProps) {
  // Map icon names to Lucide React components
  const getIcon = (iconName: string) => {
    const iconProps = { className: "w-5 h-5 text-white" }

    switch (iconName) {
      case "calendar":
        return <Calendar {...iconProps} />
      case "website":
        return <FileText {...iconProps} />
      case "whatsapp":
        return <MessageSquare {...iconProps} />
      case "phone":
        return <Phone {...iconProps} />
      case "social":
        return <Users {...iconProps} />
      case "reviews":
        return <Star {...iconProps} />
      case "blog":
        return <FileText {...iconProps} />
      case "app":
        return <Smartphone {...iconProps} />
      case "policy":
        return <Shield {...iconProps} />
      case "promo":
        return <Gift {...iconProps} />
      case "location":
        return <MapPin {...iconProps} />
      case "partners":
        return <Users {...iconProps} />
      default:
        return <ChevronRight {...iconProps} />
    }
  }

  // Get the correct URL based on the link index or type
  const getLinkUrl = (link: Link, index: number) => {
    // First button (Schedule Service) - Booking link
    if (
      index === 0 ||
      link.title.toLowerCase().includes("agendar") ||
      link.title.toLowerCase().includes("schedule") ||
      link.title.toLowerCase().includes("book")
    ) {
      return "https://customer.moovs.app/az-transfer/new/info?moovs_source=widget"
    }
    // Second button (Official Website) - Company website
    else if (index === 1 || link.icon === "website") {
      // Usar URL genérica sem referência ao domínio antigo
      return link.url || "https://aztransfer.com"
    }
    // Third button (WhatsApp) - WhatsApp chat
    else if (index === 2 || link.icon === "whatsapp") {
      return "https://wa.me/13478487765"
    }
    // Any other button - use original URL
    else {
      return link.url
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {links.map((link, index) => {
        const isSchedule =
          link.title.toLowerCase().includes("agendar") ||
          link.title.toLowerCase().includes("schedule") ||
          link.title.toLowerCase().includes("book")

        return (
          <a
            key={index}
            href={getLinkUrl(link, index)}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-[#E95440] p-3 rounded-full">{getIcon(link.icon)}</div>
                <div>
                  <h3 className="font-semibold text-lg">{link.title}</h3>
                  {link.description && <p className="text-gray-600 text-sm mt-1">{link.description}</p>}
                </div>
              </div>
              <div className={isSchedule ? "bg-[#E95440] p-2 rounded-full" : "bg-[#E95440]/10 p-2 rounded-full"}>
                <ChevronRight className={isSchedule ? "w-4 h-4 text-white" : "w-4 h-4 text-[#E95440]"} />
              </div>
            </div>
          </a>
        )
      })}
    </div>
  )
}
