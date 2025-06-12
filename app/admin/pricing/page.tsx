"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Save, X, DollarSign } from "lucide-react"

// Mock data for pricing
const mockPricing = [
  {
    id: 1,
    route: "JFK Airport to Manhattan",
    vehicleType: "Business Class",
    basePrice: 174,
    distancePrice: 2.5,
    waitingPrice: 0.75,
    nightSurcharge: 20,
    holidaySurcharge: 30,
  },
  {
    id: 2,
    route: "JFK Airport to Manhattan",
    vehicleType: "First Class",
    basePrice: 220,
    distancePrice: 3.0,
    waitingPrice: 1.0,
    nightSurcharge: 25,
    holidaySurcharge: 40,
  },
  {
    id: 3,
    route: "JFK Airport to Manhattan",
    vehicleType: "Business Van/SUV",
    basePrice: 250,
    distancePrice: 3.5,
    waitingPrice: 1.25,
    nightSurcharge: 30,
    holidaySurcharge: 50,
  },
  {
    id: 4,
    route: "LaGuardia Airport to Manhattan",
    vehicleType: "Business Class",
    basePrice: 150,
    distancePrice: 2.5,
    waitingPrice: 0.75,
    nightSurcharge: 20,
    holidaySurcharge: 30,
  },
  {
    id: 5,
    route: "LaGuardia Airport to Manhattan",
    vehicleType: "First Class",
    basePrice: 190,
    distancePrice: 3.0,
    waitingPrice: 1.0,
    nightSurcharge: 25,
    holidaySurcharge: 40,
  },
  {
    id: 6,
    route: "LaGuardia Airport to Manhattan",
    vehicleType: "Business Van/SUV",
    basePrice: 220,
    distancePrice: 3.5,
    waitingPrice: 1.25,
    nightSurcharge: 30,
    holidaySurcharge: 50,
  },
  {
    id: 7,
    route: "Newark Airport to Manhattan",
    vehicleType: "Business Class",
    basePrice: 180,
    distancePrice: 2.5,
    waitingPrice: 0.75,
    nightSurcharge: 20,
    holidaySurcharge: 30,
  },
  {
    id: 8,
    route: "Newark Airport to Manhattan",
    vehicleType: "First Class",
    basePrice: 230,
    distancePrice: 3.0,
    waitingPrice: 1.0,
    nightSurcharge: 25,
    holidaySurcharge: 40,
  },
  {
    id: 9,
    route: "Newark Airport to Manhattan",
    vehicleType: "Business Van/SUV",
    basePrice: 260,
    distancePrice: 3.5,
    waitingPrice: 1.25,
    nightSurcharge: 30,
    holidaySurcharge: 50,
  },
]

// Mock data for extra services
const mockExtraServices = [
  {
    id: 1,
    name: "Child Seat",
    price: 12,
    description: "Suitable for toddlers weighing 0-18 kg (approx 0 to 4 years).",
  },
  {
    id: 2,
    name: "Booster Seat",
    price: 12,
    description: "Suitable for children weighing 15-36 kg (approx 4 to 10 years).",
  },
  {
    id: 3,
    name: "Vodka Bottle",
    price: 39,
    description: "Absolut Vodka 0.7l Bottle",
  },
  {
    id: 4,
    name: "Bouquet of Flowers",
    price: 75,
    description: "A bouquet of seasonal flowers prepared by a local florist",
  },
  {
    id: 5,
    name: "Alcohol Package",
    price: 120,
    description: "Premium selection of spirits and mixers",
  },
  {
    id: 6,
    name: "Airport Assistance",
    price: 150,
    description: "VIP airport assistance and fast-track service",
  },
  {
    id: 7,
    name: "Bodyguard Service",
    price: 250,
    description: "Professional security personnel for your journey",
  },
]

export default function PricingPage() {
  const [pricing, setPricing] = useState(mockPricing)
  const [extraServices, setExtraServices] = useState(mockExtraServices)
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null)
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null)
  const [showAddPriceModal, setShowAddPriceModal] = useState(false)
  const [showAddServiceModal, setShowAddServiceModal] = useState(false)
  const [editedPrice, setEditedPrice] = useState({
    route: "",
    vehicleType: "",
    basePrice: 0,
    distancePrice: 0,
    waitingPrice: 0,
    nightSurcharge: 0,
    holidaySurcharge: 0,
  })
  const [editedService, setEditedService] = useState({
    name: "",
    price: 0,
    description: "",
  })

  const handleEditPrice = (price) => {
    setEditingPriceId(price.id)
    setEditedPrice({
      route: price.route,
      vehicleType: price.vehicleType,
      basePrice: price.basePrice,
      distancePrice: price.distancePrice,
      waitingPrice: price.waitingPrice,
      nightSurcharge: price.nightSurcharge,
      holidaySurcharge: price.holidaySurcharge,
    })
  }

  const handleSavePrice = (id) => {
    setPricing(pricing.map((price) => (price.id === id ? { ...price, ...editedPrice } : price)))
    setEditingPriceId(null)
  }

  const handleEditService = (service) => {
    setEditingServiceId(service.id)
    setEditedService({
      name: service.name,
      price: service.price,
      description: service.description,
    })
  }

  const handleSaveService = (id) => {
    setExtraServices(extraServices.map((service) => (service.id === id ? { ...service, ...editedService } : service)))
    setEditingServiceId(null)
  }

  const handleDeletePrice = (id) => {
    setPricing(pricing.filter((price) => price.id !== id))
  }

  const handleDeleteService = (id) => {
    setExtraServices(extraServices.filter((service) => service.id !== id))
  }

  const handleAddPrice = () => {
    const newPrice = {
      id: pricing.length + 1,
      ...editedPrice,
    }
    setPricing([...pricing, newPrice])
    setShowAddPriceModal(false)
    setEditedPrice({
      route: "",
      vehicleType: "",
      basePrice: 0,
      distancePrice: 0,
      waitingPrice: 0,
      nightSurcharge: 0,
      holidaySurcharge: 0,
    })
  }

  const handleAddService = () => {
    const newService = {
      id: extraServices.length + 1,
      ...editedService,
    }
    setExtraServices([...extraServices, newService])
    setShowAddServiceModal(false)
    setEditedService({
      name: "",
      price: 0,
      description: "",
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Pricing Management</h1>
      </div>

      {/* Route Pricing */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Route Pricing</h2>
          <button
            className="bg-[#E95440] hover:bg-[#d64a36] text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            onClick={() => setShowAddPriceModal(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Route Price
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Per Mile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waiting (min)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Night
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holiday
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pricing.map((price) => (
                <tr key={price.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {editingPriceId === price.id ? (
                      <input
                        type="text"
                        className="w-full p-1 border rounded"
                        value={editedPrice.route}
                        onChange={(e) => setEditedPrice({ ...editedPrice, route: e.target.value })}
                      />
                    ) : (
                      price.route
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {editingPriceId === price.id ? (
                      <select
                        className="w-full p-1 border rounded"
                        value={editedPrice.vehicleType}
                        onChange={(e) => setEditedPrice({ ...editedPrice, vehicleType: e.target.value })}
                      >
                        <option>Business Class</option>
                        <option>First Class</option>
                        <option>Business Van/SUV</option>
                      </select>
                    ) : (
                      price.vehicleType
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {editingPriceId === price.id ? (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          className="w-full p-1 border rounded"
                          value={editedPrice.basePrice}
                          onChange={(e) =>
                            setEditedPrice({ ...editedPrice, basePrice: Number.parseFloat(e.target.value) })
                          }
                        />
                      </div>
                    ) : (
                      `$${price.basePrice}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {editingPriceId === price.id ? (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          className="w-full p-1 border rounded"
                          value={editedPrice.distancePrice}
                          onChange={(e) =>
                            setEditedPrice({ ...editedPrice, distancePrice: Number.parseFloat(e.target.value) })
                          }
                        />
                      </div>
                    ) : (
                      `$${price.distancePrice}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {editingPriceId === price.id ? (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          className="w-full p-1 border rounded"
                          value={editedPrice.waitingPrice}
                          onChange={(e) =>
                            setEditedPrice({ ...editedPrice, waitingPrice: Number.parseFloat(e.target.value) })
                          }
                        />
                      </div>
                    ) : (
                      `$${price.waitingPrice}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {editingPriceId === price.id ? (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          className="w-full p-1 border rounded"
                          value={editedPrice.nightSurcharge}
                          onChange={(e) =>
                            setEditedPrice({ ...editedPrice, nightSurcharge: Number.parseFloat(e.target.value) })
                          }
                        />
                      </div>
                    ) : (
                      `$${price.nightSurcharge}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {editingPriceId === price.id ? (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          className="w-full p-1 border rounded"
                          value={editedPrice.holidaySurcharge}
                          onChange={(e) =>
                            setEditedPrice({ ...editedPrice, holidaySurcharge: Number.parseFloat(e.target.value) })
                          }
                        />
                      </div>
                    ) : (
                      `$${price.holidaySurcharge}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {editingPriceId === price.id ? (
                      <div className="flex space-x-2">
                        <button
                          className="p-1 hover:bg-green-100 rounded-full transition-colors"
                          onClick={() => handleSavePrice(price.id)}
                        >
                          <Save className="h-4 w-4 text-green-600" />
                        </button>
                        <button className="p-1 hover:bg-red-100 rounded-full transition-colors">
                          <X className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          onClick={() => handleEditPrice(price)}
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          onClick={() => handleDeletePrice(price.id)}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extra Services Pricing */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Extra Services Pricing</h2>
          <button
            className="bg-[#E95440] hover:bg-[#d64a36] text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            onClick={() => setShowAddServiceModal(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Service
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {extraServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {editingServiceId === service.id ? (
                      <input
                        type="text"
                        className="w-full p-1 border rounded"
                        value={editedService.name}
                        onChange={(e) => setEditedService({ ...editedService, name: e.target.value })}
                      />
                    ) : (
                      service.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {editingServiceId === service.id ? (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          className="w-full p-1 border rounded"
                          value={editedService.price}
                          onChange={(e) =>
                            setEditedService({ ...editedService, price: Number.parseFloat(e.target.value) })
                          }
                        />
                      </div>
                    ) : (
                      `$${service.price}`
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {editingServiceId === service.id ? (
                      <textarea
                        className="w-full p-1 border rounded"
                        value={editedService.description}
                        onChange={(e) => setEditedService({ ...editedService, description: e.target.value })}
                      />
                    ) : (
                      service.description
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {editingServiceId === service.id ? (
                      <div className="flex space-x-2">
                        <button
                          className="p-1 hover:bg-green-100 rounded-full transition-colors"
                          onClick={() => handleSaveService(service.id)}
                        >
                          <Save className="h-4 w-4 text-green-600" />
                        </button>
                        <button
                          className="p-1 hover:bg-red-100 rounded-full transition-colors"
                          onClick={() => setEditingServiceId(null)}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Route Price Modal */}
      {showAddPriceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Add New Route Price</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Route</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. JFK Airport to Manhattan"
                    value={editedPrice.route}
                    onChange={(e) => setEditedPrice({ ...editedPrice, route: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={editedPrice.vehicleType}
                    onChange={(e) => setEditedPrice({ ...editedPrice, vehicleType: e.target.value })}
                  >
                    <option value="">Select Vehicle Type</option>
                    <option>Business Class</option>
                    <option>First Class</option>
                    <option>Business Van/SUV</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. 150"
                    value={editedPrice.basePrice || ""}
                    onChange={(e) => setEditedPrice({ ...editedPrice, basePrice: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Per Mile Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. 2.50"
                    value={editedPrice.distancePrice || ""}
                    onChange={(e) =>
                      setEditedPrice({ ...editedPrice, distancePrice: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Waiting Price ($/min)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. 0.75"
                    value={editedPrice.waitingPrice || ""}
                    onChange={(e) =>
                      setEditedPrice({ ...editedPrice, waitingPrice: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Night Surcharge ($)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. 20"
                    value={editedPrice.nightSurcharge || ""}
                    onChange={(e) =>
                      setEditedPrice({ ...editedPrice, nightSurcharge: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Holiday Surcharge ($)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. 30"
                    value={editedPrice.holidaySurcharge || ""}
                    onChange={(e) =>
                      setEditedPrice({ ...editedPrice, holidaySurcharge: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-4">
              <button
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowAddPriceModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#E95440] hover:bg-[#d64a36] text-white rounded-lg transition-colors"
                onClick={handleAddPrice}
              >
                Add Price
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Add New Service</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Service Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g. Child Seat"
                  value={editedService.name}
                  onChange={(e) => setEditedService({ ...editedService, name: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Price ($)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g. 12"
                  value={editedService.price || ""}
                  onChange={(e) => setEditedService({ ...editedService, price: Number.parseFloat(e.target.value) })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full p-2 border rounded-md h-24"
                  placeholder="e.g. Suitable for toddlers weighing 0-18 kg (approx 0 to 4 years)."
                  value={editedService.description}
                  onChange={(e) => setEditedService({ ...editedService, description: e.target.value })}
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-4">
              <button
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowAddServiceModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#E95440] hover:bg-[#d64a36] text-white rounded-lg transition-colors"
                onClick={handleAddService}
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
