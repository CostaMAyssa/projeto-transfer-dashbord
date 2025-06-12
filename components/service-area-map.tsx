"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "lucide-react"

interface ServiceAreaMapProps {
  language: string
}

export default function ServiceAreaMap({ language }: ServiceAreaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Dynamically import Leaflet only on client-side
    const loadMap = async () => {
      if (!mapRef.current) return

      // Se já temos uma instância do mapa, limpe-a primeiro
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      try {
        // Verificar se o Leaflet CSS já está carregado
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          // Create a script tag for Leaflet CSS
          const linkElement = document.createElement("link")
          linkElement.rel = "stylesheet"
          linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(linkElement)

          // Wait for the CSS to load
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        // Import Leaflet
        const L = await import("leaflet")
        setMapLoaded(true)

        // Create map centered on New York City
        const map = L.map(mapRef.current).setView([40.7128, -74.006], 11)
        mapInstanceRef.current = map

        // Add OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        // Define the service area polygon coordinates
        const serviceAreaCoords = [
          [41.405167, -74.117908], // Woodbury, NY
          [41.2, -73.5], // Linha direta para CT
          [40.9115, -72.8652], // Suffolk County/Long Island
          [40.5795, -73.1701], // South Long Island
          [40.4773, -74.259], // Staten Island
          [40.9175, -74.259], // Upper NJ
          [41.405167, -74.117908], // Fechar o polígono voltando para Woodbury
        ]

        // Create the polygon
        const serviceArea = L.polygon(serviceAreaCoords, {
          color: "#E95440",
          fillColor: "#E95440",
          fillOpacity: 0.2,
          weight: 2,
        }).addTo(map)

        // Add a marker for the company location
        const companyMarker = L.marker([40.7128, -74.006]).addTo(map)

        // Add a popup to the marker
        companyMarker
          .bindPopup(`<div style="font-family: Arial, sans-serif; padding: 5px;">
          <strong>AZ Transfer</strong><br>
          ${language === "pt" ? "Transporte Executivo em Nova York" : "Executive Transportation in New York"}
        </div>`)
          .openPopup()

        // Fit the map to the service area bounds
        map.fitBounds(serviceArea.getBounds())

        setLoading(false)
      } catch (error) {
        console.error("Error loading map:", error)
        setLoading(false)
      }
    }

    // Only load the map if we're in the browser
    if (typeof window !== "undefined") {
      loadMap()
    }

    return () => {
      // Clean up
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [language])

  return (
    <div className="w-full h-[500px] relative rounded-xl overflow-hidden shadow-md">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="flex flex-col items-center">
            <Loader className="w-10 h-10 text-[#E95440] animate-spin mb-2" />
            <p className="text-gray-600">{language === "pt" ? "Carregando mapa..." : "Loading map..."}</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
