"use client"

import { useState } from "react"
import { Save, Globe, Bell, Lock, Shield, CreditCard, Mail } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [language, setLanguage] = useState("en")
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    mobile: false,
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Settings</h1>
        <button className="btn-primary bg-secondary flex items-center text-sm" onClick={handleSave} disabled={isSaving}>
          <Save className="h-5 w-5 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-border overflow-hidden">
            <nav className="flex flex-col">
              <button
                className={`flex items-center px-4 py-3 text-left ${activeTab === "general" ? "bg-secondary/10 border-l-4 border-secondary" : "hover:bg-gray-50"}`}
                onClick={() => setActiveTab("general")}
              >
                <Globe className={`h-5 w-5 mr-3 ${activeTab === "general" ? "text-secondary" : "text-gray-500"}`} />
                <span className={activeTab === "general" ? "font-medium" : ""}>General</span>
              </button>
              <button
                className={`flex items-center px-4 py-3 text-left ${activeTab === "notifications" ? "bg-secondary/10 border-l-4 border-secondary" : "hover:bg-gray-50"}`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell
                  className={`h-5 w-5 mr-3 ${activeTab === "notifications" ? "text-secondary" : "text-gray-500"}`}
                />
                <span className={activeTab === "notifications" ? "font-medium" : ""}>Notifications</span>
              </button>
              <button
                className={`flex items-center px-4 py-3 text-left ${activeTab === "security" ? "bg-secondary/10 border-l-4 border-secondary" : "hover:bg-gray-50"}`}
                onClick={() => setActiveTab("security")}
              >
                <Lock className={`h-5 w-5 mr-3 ${activeTab === "security" ? "text-secondary" : "text-gray-500"}`} />
                <span className={activeTab === "security" ? "font-medium" : ""}>Security</span>
              </button>
              <button
                className={`flex items-center px-4 py-3 text-left ${activeTab === "privacy" ? "bg-secondary/10 border-l-4 border-secondary" : "hover:bg-gray-50"}`}
                onClick={() => setActiveTab("privacy")}
              >
                <Shield className={`h-5 w-5 mr-3 ${activeTab === "privacy" ? "text-secondary" : "text-gray-500"}`} />
                <span className={activeTab === "privacy" ? "font-medium" : ""}>Privacy</span>
              </button>
              <button
                className={`flex items-center px-4 py-3 text-left ${activeTab === "billing" ? "bg-secondary/10 border-l-4 border-secondary" : "hover:bg-gray-50"}`}
                onClick={() => setActiveTab("billing")}
              >
                <CreditCard
                  className={`h-5 w-5 mr-3 ${activeTab === "billing" ? "text-secondary" : "text-gray-500"}`}
                />
                <span className={activeTab === "billing" ? "font-medium" : ""}>Billing</span>
              </button>
              <button
                className={`flex items-center px-4 py-3 text-left ${activeTab === "email" ? "bg-secondary/10 border-l-4 border-secondary" : "hover:bg-gray-50"}`}
                onClick={() => setActiveTab("email")}
              >
                <Mail className={`h-5 w-5 mr-3 ${activeTab === "email" ? "text-secondary" : "text-gray-500"}`} />
                <span className={activeTab === "email" ? "font-medium" : ""}>Email</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "general" && (
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="text-base font-medium mb-6">General Settings</h2>

              {/* Company Information */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Company Name</label>
                    <input type="text" className="w-full p-2 border rounded-md" defaultValue="AZ Transfer" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Business Email</label>
                    <input type="email" className="w-full p-2 border rounded-md" defaultValue="info@aztransfer.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Phone Number</label>
                    <input type="tel" className="w-full p-2 border rounded-md" defaultValue="+1 (347) 848-7765" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Website</label>
                    <input type="url" className="w-full p-2 border rounded-md" defaultValue="https://aztransfer.com" />
                  </div>
                </div>
              </div>

              {/* Language Settings */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-4">Language & Region</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Language</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="pt">Português</option>
                    </select>
                    <p className="text-3xs text-gray-500 mt-1">This will change the language for the admin dashboard</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Time Zone</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>America/New_York (UTC-05:00)</option>
                      <option>America/Chicago (UTC-06:00)</option>
                      <option>America/Los_Angeles (UTC-08:00)</option>
                      <option>Europe/London (UTC+00:00)</option>
                      <option>Europe/Paris (UTC+01:00)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Date & Currency Format */}
              <div>
                <h3 className="text-sm font-medium mb-4">Date & Currency Format</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Date Format</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Currency</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>BRL (R$)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="text-base font-medium mb-6">Notification Settings</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="text-sm font-medium">Email Notifications</h3>
                    <p className="text-xs text-gray-500">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.email}
                      onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="text-sm font-medium">Browser Notifications</h3>
                    <p className="text-xs text-gray-500">Receive notifications in your browser</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.browser}
                      onChange={() => setNotifications({ ...notifications, browser: !notifications.browser })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="text-sm font-medium">Mobile Push Notifications</h3>
                    <p className="text-xs text-gray-500">Receive notifications on your mobile device</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.mobile}
                      onChange={() => setNotifications({ ...notifications, mobile: !notifications.mobile })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="text-base font-medium mb-6">Security Settings</h2>

              {/* Change Password */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Current Password</label>
                    <input type="password" className="w-full p-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">New Password</label>
                    <input type="password" className="w-full p-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Confirm New Password</label>
                    <input type="password" className="w-full p-2 border rounded-md" />
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                  <button className="px-3 py-1 text-sm bg-secondary text-white rounded">Enable</button>
                </div>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account by requiring both your password and a verification code
                  from your mobile phone.
                </p>
              </div>
            </div>
          )}

          {(activeTab === "privacy" || activeTab === "billing" || activeTab === "email") && (
            <div className="bg-white rounded-lg border border-border p-6 flex items-center justify-center h-64">
              <p className="text-xs text-gray-500">This section is under development</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
