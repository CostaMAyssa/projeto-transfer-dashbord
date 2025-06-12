"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Filter, Download } from "lucide-react"

// Mock data for vehicles
const mockVehicles = [
  {
    id: "V001",
    name: "Mercedes-Benz E-Class",
    type: "Business Class",
    licensePlate: "NY-1234",
    status: "Active",
    passengers: 3,
    luggage: 2,
    year: 2022,
    image: "https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-e-class-2598047.webp",
  },
  {
    id: "V002",
    name: "Mercedes-Benz S-Class",
    type: "First Class",
    licensePlate: "NY-5678",
    status: "Active",
    passengers: 3,
    luggage: 3,
    year: 2023,
    image: "https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-s-class-2598047.webp",
  },
  {
    id: "V003",
    name: "Mercedes-Benz V-Class",
    type: "Business Van/SUV",
    licensePlate: "NY-9012",
    status: "Active",
    passengers: 7,
    luggage: 5,
    year: 2022,
    image: "https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-v-class-2598047.webp",
  },
  {
    id: "V004",
    name: "BMW 5 Series",
    type: "Business Class",
    licensePlate: "NY-3456",
    status: "Maintenance",
    passengers: 3,
    luggage: 2,
    year: 2021,
    image: "https://content.app-sources.com/s/98064488125095989/uploads/Images/bmw-5-series-2598047.webp",
  },
  {
    id: "V005",
    name: "Audi A8",
    type: "First Class",
    licensePlate: "NY-7890",
    status: "Active",
    passengers: 3,
    luggage: 3,
    year: 2022,
    image: "https://content.app-sources.com/s/98064488125095989/uploads/Images/audi-a8-2598047.webp",
  },
  {
    id: "V006",
    name: "Chevrolet Suburban",
    type: "Business Van/SUV",
    licensePlate: "NY-1357",
    status: "Active",
    passengers: 7,
    luggage: 6,
    year: 2021,
    image: "https://content.app-sources.com/s/98064488125095989/uploads/Images/chevrolet-suburban-2598047.webp",
  },
  {
    id: "V007",
    name: "Cadillac XTS",
    type: "Business Class",
    licensePlate: "NY-2468",
    status: "Inactive",
    passengers: 3,
    luggage: 2,
    year: 2020,
    image: "https://content.app-sources.com/s/98064488125095989/uploads/Images/cadillac-xts-2598047.webp",
  },
  {
    id: "V008",
    name: "BMW 7 Series",
    type: "First Class",
    licensePlate: "NY-3690",
    status: "Active",
    passengers: 3,
    luggage: 3,
    year: 2022,
    image: "https://content.app-sources.com/s/98064488125095989/uploads/Images/bmw-7-series-2598047.webp",
  },
]

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(mockVehicles)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentVehicles = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleDeleteClick = (id: string) => {
    setSelectedVehicle(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (selectedVehicle) {
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== selectedVehicle))
      setShowDeleteModal(false)
      setSelectedVehicle(null)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Vehicles</h1>
        <button className="btn-primary bg-secondary flex items-center text-sm" onClick={() => setShowAddModal(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Add Vehicle
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search vehicles..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#E95440] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              Filter
            </button>
            <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 mr-2 text-gray-500" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {currentVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <Image src={vehicle.image || "/placeholder.svg"} alt={vehicle.name} fill className="object-contain p-4" />
              <div
                className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                  vehicle.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : vehicle.status === "Maintenance"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {vehicle.status}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-lg">{vehicle.name}</h3>
                  <p className="text-sm text-gray-600">{vehicle.type}</p>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/admin/vehicles/edit/${vehicle.id}`}>
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                  </Link>
                  <button
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={() => handleDeleteClick(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>License: {vehicle.licensePlate}</span>
                <span>Year: {vehicle.year}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Passengers: {vehicle.passengers}</span>
                <span>Luggage: {vehicle.luggage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page ? "bg-[#E95440] text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Add New Vehicle</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. Mercedes-Benz E-Class"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Business Class</option>
                    <option>First Class</option>
                    <option>Business Van/SUV</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">License Plate</label>
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="e.g. NY-1234" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <input type="number" className="w-full p-2 border rounded-md" placeholder="e.g. 2023" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Active</option>
                    <option>Maintenance</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Passengers</label>
                  <input type="number" className="w-full p-2 border rounded-md" placeholder="e.g. 3" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Luggage Capacity</label>
                  <input type="number" className="w-full p-2 border rounded-md" placeholder="e.g. 2" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Vehicle Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 mt-2">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-[#E95440] hover:text-[#d64a36] focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-4">
              <button
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#E95440] hover:bg-[#d64a36] text-white rounded-lg transition-colors">
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this vehicle? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
