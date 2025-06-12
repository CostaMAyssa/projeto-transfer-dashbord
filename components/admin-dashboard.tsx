"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Home,
  Car,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  DollarSign,
  BarChart3,
  Search,
  ChevronDown,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function AdminDashboard({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { locale, translations } = useLanguage()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    localStorage.removeItem("admin_auth_time")
    window.location.href = "/admin/login"
  }

  return (
    <div className="flex h-screen bg-background-light">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 z-50 h-full w-20 md:w-20 bg-primary flex-shrink-0 flex flex-col items-center py-6 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:rounded-tr-xl md:rounded-br-xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full items-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="relative h-10 w-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AZ_Transfer_Logo-2114669%20%281%29-B2wSNbPiBfGCv1l8HXV55FJExLAfx1.webp"
                alt="AZ Transfer Logo"
                fill
                className="object-contain p-2"
              />
            </div>
            <button className="absolute top-4 right-4 md:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 w-full">
            <ul className="space-y-6 flex flex-col items-center">
              <li>
                <Link
                  href="/admin"
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded transition-colors ${
                    pathname === "/admin"
                      ? "text-white bg-secondary"
                      : "text-gray-400 hover:text-white hover:bg-background-dark"
                  }`}
                >
                  <Home className="h-5 w-5" />
                  <span className="text-2xs mt-1">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/bookings"
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded transition-colors ${
                    pathname.includes("/admin/bookings")
                      ? "text-white bg-secondary"
                      : "text-gray-400 hover:text-white hover:bg-background-dark"
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-2xs mt-1">Trips</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/vehicles"
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded transition-colors ${
                    pathname.includes("/admin/vehicles")
                      ? "text-white bg-secondary"
                      : "text-gray-400 hover:text-white hover:bg-background-dark"
                  }`}
                >
                  <Car className="h-5 w-5" />
                  <span className="text-2xs mt-1">Cars</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/drivers"
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded transition-colors ${
                    pathname.includes("/admin/drivers")
                      ? "text-white bg-secondary"
                      : "text-gray-400 hover:text-white hover:bg-background-dark"
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-2xs mt-1">Drivers</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/pricing"
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded transition-colors ${
                    pathname.includes("/admin/pricing")
                      ? "text-white bg-secondary"
                      : "text-gray-400 hover:text-white hover:bg-background-dark"
                  }`}
                >
                  <DollarSign className="h-5 w-5" />
                  <span className="text-2xs mt-1">Pricing</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/reports"
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded transition-colors ${
                    pathname.includes("/admin/reports")
                      ? "text-white bg-secondary"
                      : "text-gray-400 hover:text-white hover:bg-background-dark"
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-2xs mt-1">Reports</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/settings"
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded transition-colors ${
                    pathname.includes("/admin/settings")
                      ? "text-white bg-secondary"
                      : "text-gray-400 hover:text-white hover:bg-background-dark"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-2xs mt-1">Settings</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* User */}
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center w-12 h-12 text-gray-400 hover:text-white hover:bg-background-dark rounded transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-2xs mt-1">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-background-white border-b border-border h-16 flex items-center px-4 md:px-6">
          <button className="md:hidden mr-4" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center">
            <div className="flex items-center">
              <div className="flex items-center text-sm md:text-base">
                {pathname === "/admin" ? (
                  <h1 className="font-medium">Dashboard</h1>
                ) : (
                  <>
                    <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                      Dashboard
                    </Link>
                    {pathname.includes("/admin/bookings") && (
                      <>
                        <span className="mx-2 text-gray-400">/</span>
                        {pathname === "/admin/bookings" ? (
                          <h1 className="font-medium">Trips</h1>
                        ) : (
                          <>
                            <Link href="/admin/bookings" className="text-gray-500 hover:text-gray-700">
                              Trips
                            </Link>
                            <span className="mx-2 text-gray-400">/</span>
                            <h1 className="font-medium">Details</h1>
                          </>
                        )}
                      </>
                    )}
                    {pathname.includes("/admin/vehicles") && (
                      <>
                        <span className="mx-2 text-gray-400">/</span>
                        <h1 className="font-medium">Vehicles</h1>
                      </>
                    )}
                    {pathname.includes("/admin/drivers") && (
                      <>
                        <span className="mx-2 text-gray-400">/</span>
                        <h1 className="font-medium">Drivers</h1>
                      </>
                    )}
                    {pathname.includes("/admin/pricing") && (
                      <>
                        <span className="mx-2 text-gray-400">/</span>
                        <h1 className="font-medium">Pricing</h1>
                      </>
                    )}
                    {pathname.includes("/admin/reports") && (
                      <>
                        <span className="mx-2 text-gray-400">/</span>
                        <h1 className="font-medium">Reports</h1>
                      </>
                    )}
                    {pathname.includes("/admin/settings") && (
                      <>
                        <span className="mx-2 text-gray-400">/</span>
                        <h1 className="font-medium">Settings</h1>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray" />
              <input
                type="text"
                placeholder={translations.common.search}
                className="input-standard pl-8 py-1.5 text-sm w-40"
              />
            </div>
            <div className="flex items-center relative">
              <div ref={dropdownRef}>
                <button
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-background-light flex items-center justify-center overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                      alt="User profile"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <span className="ml-2 text-sm font-medium hidden md:block">Admin</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 hidden md:block transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {locale === "pt" ? "Minha Conta" : locale === "es" ? "Mi Cuenta" : "My Account"}
                    </Link>
                    <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {translations.common.settings}
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {locale === "pt" ? "Sair" : locale === "es" ? "Cerrar sesión" : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background-light">{children}</main>
      </div>
    </div>
  )
}
