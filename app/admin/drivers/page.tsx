"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Phone,
  Mail,
  Calendar,
} from "lucide-react"

// Mock data for drivers
const mockDrivers = [
  {
    id: "D001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    license: "NY-DL-12345",
    hireDate: "2021-05-15",
    rating: 4.8,
    trips: 245,
    vehicle: "Mercedes-Benz E-Class",
  },
  {
    id: "D002",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 234-5678",
    status: "Active",
    license: "NY-DL-23456",
    hireDate: "2021-06-20",
    rating: 4.9,
    trips: 198,
    vehicle: "BMW 5 Series",
  },
  {
    id: "D003",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1 (555) 345-6789",
    status: "On Leave",
    license: "NY-DL-34567",
    hireDate: "2021-07-10",
    rating: 4.7,
    trips: 176,
    vehicle: "Mercedes-Benz S-Class",
  },
  {
    id: "D004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 456-7890",
    status: "Active",
    license: "NY-DL-45678",
    hireDate: "2021-08-05",
    rating: 4.9,
    trips: 210,
    vehicle: "Audi A8",
  },
  {
    id: "D005",
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    phone: "+1 (555) 567-8901",
    status: "Inactive",
    license: "NY-DL-56789",
    hireDate: "2021-09-15",
    rating: 4.5,
    trips: 132,
    vehicle: "Cadillac XTS",
  },
  {
    id: "D006",
    name: "Jessica Miller",
    email: "jessica.miller@example.com",
    phone: "+1 (555) 678-9012",
    status: "Active",
    license: "NY-DL-67890",
    hireDate: "2021-10-20",
    rating: 4.8,
    trips: 187,
    vehicle: "Mercedes-Benz V-Class",
  },
  {
    id: "D007",
    name: "David Garcia",
    email: "david.garcia@example.com",
    phone: "+1 (555) 789-0123",
    status: "Active",
    license: "NY-DL-78901",
    hireDate: "2021-11-10",
    rating: 4.7,
    trips: 156,
    vehicle: "Chevrolet Suburban",
  },
  {
    id: "D008",
    name: "Lisa Martinez",
    email: "lisa.martinez@example.com",
    phone: "+1 (555) 890-1234",
    status: "Active",
    license: "NY-DL-89012",
    hireDate: "2021-12-05",
    rating: 4.9,
    trips: 201,
    vehicle: "BMW 7 Series",
  },
]

export default function DriversPage() {
  const [drivers, setDrivers] = useState(mockDrivers)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)

  // Filter drivers based on search term
  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentDrivers = filteredDrivers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleDeleteClick = (id: string) => {
    setSelectedDriver(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (selectedDriver) {
      setDrivers(drivers.filter((driver) => driver.id !== selectedDriver))
      setShowDeleteModal(false)
      setSelectedDriver(null)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Drivers</h1>
        <button className="btn-primary bg-secondary flex items-center text-sm" onClick={() => setShowAddModal(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Add Driver
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
              placeholder="Search drivers..."
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

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {currentDrivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-lg">
                    {driver.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-lg">{driver.name}</h3>
                    <p className="text-sm text-gray-600">ID: {driver.id}</p>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    driver.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : driver.status === "On Leave"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {driver.status}
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">{driver.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">{driver.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">Hired: {driver.hireDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Rating</p>
                  <div className="flex items-center">
                    <span className="text-lg font-semibold">{driver.rating}</span>
                    <div className="ml-1 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(driver.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Trips</p>
                  <p className="text-lg font-semibold">{driver.trips}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span>Vehicle: {driver.vehicle}</span>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/admin/drivers/edit/${driver.id}`}>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                  </Link>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => handleDeleteClick(driver.id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
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

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Add New Driver</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="e.g. John" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="e.g. Smith" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. john.smith@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" className="w-full p-2 border rounded-md" placeholder="e.g. +1 (555) 123-4567" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Driver License</label>
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="e.g. NY-DL-12345" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hire Date</label>
                  <input type="date" className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Assigned Vehicle</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Mercedes-Benz E-Class</option>
                  <option>Mercedes-Benz S-Class</option>
                  <option>Mercedes-Benz V-Class</option>
                  <option>BMW 5 Series</option>
                  <option>BMW 7 Series</option>
                  <option>Audi A8</option>
                  <option>Chevrolet Suburban</option>
                  <option>Cadillac XTS</option>
                </select>
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
                Add Driver
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
                Are you sure you want to delete this driver? This action cannot be undone.
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
