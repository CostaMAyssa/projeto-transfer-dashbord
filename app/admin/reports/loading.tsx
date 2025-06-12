export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-64 bg-gray-200 rounded-md mt-2"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
          <div className="h-10 w-28 bg-gray-200 rounded-md"></div>
          <div className="h-10 w-28 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
                <div className="h-8 w-32 bg-gray-200 rounded-md mt-2"></div>
              </div>
              <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
            </div>
            <div className="flex items-center mt-4">
              <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
              <div className="h-4 w-32 bg-gray-200 rounded-md ml-2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="h-5 w-40 bg-gray-200 rounded-md"></div>
              <div className="h-5 w-32 bg-gray-200 rounded-md"></div>
            </div>
            <div className="h-64 bg-gray-100 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Vehicle and driver performance skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="h-5 w-40 bg-gray-200 rounded-md"></div>
              <div className="h-5 w-20 bg-gray-200 rounded-md"></div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-md mr-3"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5">
                      <div
                        className="h-full bg-gray-200 rounded-full"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent bookings skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="h-5 w-32 bg-gray-200 rounded-md"></div>
          <div className="h-5 w-20 bg-gray-200 rounded-md"></div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
                <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
                <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
                <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
