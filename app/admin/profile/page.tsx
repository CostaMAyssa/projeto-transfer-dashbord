"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { User, Mail, Phone, Lock, Bell, Shield, LogOut, Save, Edit2 } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const { locale, translations } = useLanguage()
  const [activeTab, setActiveTab] = useState("personal")
  const [editMode, setEditMode] = useState(false)

  // Mock user data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    language: locale === "pt" ? "Português" : locale === "es" ? "Español" : "English",
    timezone: "UTC-3 (São Paulo)",
    lastLogin: "2023-04-01 14:32",
    twoFactorEnabled: false,
    notifications: {
      email: true,
      push: false,
      sms: true,
    },
  })

  const handleSaveChanges = () => {
    // Here you would typically save changes to the backend
    setEditMode(false)
    // Show success message
    alert(
      locale === "pt"
        ? "Alterações salvas com sucesso!"
        : locale === "es"
          ? "¡Cambios guardados con éxito!"
          : "Changes saved successfully!",
    )
  }

  const tabTitle = (id: string) => {
    switch (id) {
      case "personal":
        return locale === "pt"
          ? "Informações Pessoais"
          : locale === "es"
            ? "Información Personal"
            : "Personal Information"
      case "security":
        return locale === "pt" ? "Segurança" : locale === "es" ? "Seguridad" : "Security"
      case "notifications":
        return locale === "pt" ? "Notificações" : locale === "es" ? "Notificaciones" : "Notifications"
      case "sessions":
        return locale === "pt" ? "Sessões" : locale === "es" ? "Sesiones" : "Sessions"
      default:
        return ""
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                alt="User profile"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-xl font-medium text-gray-900">{userData.name}</h1>
              <p className="text-sm text-gray-500">{userData.email}</p>
              <p className="text-xs text-gray-400 mt-1">{userData.role}</p>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="ml-auto flex items-center text-sm text-primary hover:text-primary-dark"
            >
              {editMode ? (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  <span>{locale === "pt" ? "Salvar" : locale === "es" ? "Guardar" : "Save"}</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-1" />
                  <span>{locale === "pt" ? "Editar" : locale === "es" ? "Editar" : "Edit"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {["personal", "security", "notifications", "sessions"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === tab ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tabTitle(tab)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === "pt" ? "Nome" : locale === "es" ? "Nombre" : "Name"}
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      className="input-standard w-full"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{userData.name}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === "pt" ? "Email" : locale === "es" ? "Correo electrónico" : "Email"}
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      className="input-standard w-full"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{userData.email}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === "pt" ? "Telefone" : locale === "es" ? "Teléfono" : "Phone"}
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      className="input-standard w-full"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{userData.phone}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === "pt" ? "Idioma" : locale === "es" ? "Idioma" : "Language"}
                  </label>
                  {editMode ? (
                    <select
                      className="input-standard w-full"
                      value={userData.language}
                      onChange={(e) => setUserData({ ...userData, language: e.target.value })}
                    >
                      <option value="English">English</option>
                      <option value="Português">Português</option>
                      <option value="Español">Español</option>
                    </select>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-gray-900">{userData.language}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === "pt" ? "Fuso Horário" : locale === "es" ? "Zona Horaria" : "Timezone"}
                  </label>
                  {editMode ? (
                    <select
                      className="input-standard w-full"
                      value={userData.timezone}
                      onChange={(e) => setUserData({ ...userData, timezone: e.target.value })}
                    >
                      <option value="UTC-3 (São Paulo)">UTC-3 (São Paulo)</option>
                      <option value="UTC-5 (New York)">UTC-5 (New York)</option>
                      <option value="UTC+0 (London)">UTC+0 (London)</option>
                    </select>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-gray-900">{userData.timezone}</span>
                    </div>
                  )}
                </div>
              </div>

              {editMode && (
                <div className="flex justify-end mt-6">
                  <button onClick={() => setEditMode(false)} className="btn-secondary mr-2">
                    {locale === "pt" ? "Cancelar" : locale === "es" ? "Cancelar" : "Cancel"}
                  </button>
                  <button onClick={handleSaveChanges} className="btn-primary">
                    {locale === "pt" ? "Salvar Alterações" : locale === "es" ? "Guardar Cambios" : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Lock className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-base font-medium text-gray-900">
                        {locale === "pt" ? "Alterar Senha" : locale === "es" ? "Cambiar Contraseña" : "Change Password"}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {locale === "pt"
                              ? "Senha Atual"
                              : locale === "es"
                                ? "Contraseña Actual"
                                : "Current Password"}
                          </label>
                          <input type="password" className="input-standard mt-1 w-full" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {locale === "pt" ? "Nova Senha" : locale === "es" ? "Nueva Contraseña" : "New Password"}
                          </label>
                          <input type="password" className="input-standard mt-1 w-full" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {locale === "pt"
                              ? "Confirmar Nova Senha"
                              : locale === "es"
                                ? "Confirmar Nueva Contraseña"
                                : "Confirm New Password"}
                          </label>
                          <input type="password" className="input-standard mt-1 w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button type="submit" className="btn-primary">
                    {locale === "pt"
                      ? "Atualizar Senha"
                      : locale === "es"
                        ? "Actualizar Contraseña"
                        : "Update Password"}
                  </button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Shield className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-base font-medium text-gray-900">
                          {locale === "pt"
                            ? "Autenticação de Dois Fatores"
                            : locale === "es"
                              ? "Autenticación de Dos Factores"
                              : "Two-Factor Authentication"}
                        </h3>
                        <div className="ml-4 flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userData.twoFactorEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {userData.twoFactorEnabled
                              ? locale === "pt"
                                ? "Ativado"
                                : locale === "es"
                                  ? "Activado"
                                  : "Enabled"
                              : locale === "pt"
                                ? "Desativado"
                                : locale === "es"
                                  ? "Desactivado"
                                  : "Disabled"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {locale === "pt"
                          ? "Adicione uma camada extra de segurança à sua conta. Você precisará inserir um código de verificação além da sua senha ao fazer login."
                          : locale === "es"
                            ? "Añade una capa adicional de seguridad a tu cuenta. Necesitarás introducir un código de verificación además de tu contraseña al iniciar sesión."
                            : "Add an extra layer of security to your account. You'll need to enter a verification code in addition to your password when signing in."}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="button"
                    className={userData.twoFactorEnabled ? "btn-secondary" : "btn-primary"}
                    onClick={() => setUserData({ ...userData, twoFactorEnabled: !userData.twoFactorEnabled })}
                  >
                    {userData.twoFactorEnabled
                      ? locale === "pt"
                        ? "Desativar"
                        : locale === "es"
                          ? "Desactivar"
                          : "Disable"
                      : locale === "pt"
                        ? "Ativar"
                        : locale === "es"
                          ? "Activar"
                          : "Enable"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-gray-400" />
                    {locale === "pt"
                      ? "Preferências de Notificação"
                      : locale === "es"
                        ? "Preferencias de Notificación"
                        : "Notification Preferences"}
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email-notifications"
                          name="email-notifications"
                          type="checkbox"
                          className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                          checked={userData.notifications.email}
                          onChange={() =>
                            setUserData({
                              ...userData,
                              notifications: {
                                ...userData.notifications,
                                email: !userData.notifications.email,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email-notifications" className="font-medium text-gray-700">
                          {locale === "pt"
                            ? "Notificações por Email"
                            : locale === "es"
                              ? "Notificaciones por Correo"
                              : "Email Notifications"}
                        </label>
                        <p className="text-gray-500">
                          {locale === "pt"
                            ? "Receba atualizações por email sobre suas reservas e atividades da conta."
                            : locale === "es"
                              ? "Recibe actualizaciones por correo electrónico sobre tus reservas y actividades de la cuenta."
                              : "Get email updates about your bookings and account activity."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="push-notifications"
                          name="push-notifications"
                          type="checkbox"
                          className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                          checked={userData.notifications.push}
                          onChange={() =>
                            setUserData({
                              ...userData,
                              notifications: {
                                ...userData.notifications,
                                push: !userData.notifications.push,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="push-notifications" className="font-medium text-gray-700">
                          {locale === "pt"
                            ? "Notificações Push"
                            : locale === "es"
                              ? "Notificaciones Push"
                              : "Push Notifications"}
                        </label>
                        <p className="text-gray-500">
                          {locale === "pt"
                            ? "Receba notificações em tempo real no seu navegador."
                            : locale === "es"
                              ? "Recibe notificaciones en tiempo real en tu navegador."
                              : "Get real-time notifications in your browser."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="sms-notifications"
                          name="sms-notifications"
                          type="checkbox"
                          className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                          checked={userData.notifications.sms}
                          onChange={() =>
                            setUserData({
                              ...userData,
                              notifications: {
                                ...userData.notifications,
                                sms: !userData.notifications.sms,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="sms-notifications" className="font-medium text-gray-700">
                          {locale === "pt"
                            ? "Notificações SMS"
                            : locale === "es"
                              ? "Notificaciones SMS"
                              : "SMS Notifications"}
                        </label>
                        <p className="text-gray-500">
                          {locale === "pt"
                            ? "Receba alertas importantes via SMS."
                            : locale === "es"
                              ? "Recibe alertas importantes por SMS."
                              : "Get important alerts via SMS."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button type="button" className="btn-primary">
                    {locale === "pt"
                      ? "Salvar Preferências"
                      : locale === "es"
                        ? "Guardar Preferencias"
                        : "Save Preferences"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === "sessions" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {locale === "pt" ? "Sessões Ativas" : locale === "es" ? "Sesiones Activas" : "Active Sessions"}
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="flex justify-between text-sm font-medium text-gray-500">
                      <div className="w-1/3">
                        {locale === "pt" ? "Dispositivo" : locale === "es" ? "Dispositivo" : "Device"}
                      </div>
                      <div className="w-1/3">
                        {locale === "pt" ? "Localização" : locale === "es" ? "Ubicación" : "Location"}
                      </div>
                      <div className="w-1/3">
                        {locale === "pt" ? "Último Acesso" : locale === "es" ? "Último Acceso" : "Last Active"}
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="px-4 py-3 flex justify-between items-center">
                      <div className="w-1/3 flex items-center">
                        <div className="text-sm font-medium text-gray-900">Chrome / Windows</div>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {locale === "pt" ? "Atual" : locale === "es" ? "Actual" : "Current"}
                        </span>
                      </div>
                      <div className="w-1/3 text-sm text-gray-500">São Paulo, Brazil</div>
                      <div className="w-1/3 text-sm text-gray-500">
                        {locale === "pt" ? "Agora" : locale === "es" ? "Ahora" : "Now"}
                      </div>
                    </div>
                    <div className="px-4 py-3 flex justify-between items-center">
                      <div className="w-1/3 text-sm font-medium text-gray-900">Safari / iPhone</div>
                      <div className="w-1/3 text-sm text-gray-500">Rio de Janeiro, Brazil</div>
                      <div className="w-1/3 text-sm text-gray-500">
                        2 {locale === "pt" ? "horas atrás" : locale === "es" ? "horas atrás" : "hours ago"}
                      </div>
                    </div>
                    <div className="px-4 py-3 flex justify-between items-center">
                      <div className="w-1/3 text-sm font-medium text-gray-900">Firefox / Mac</div>
                      <div className="w-1/3 text-sm text-gray-500">New York, USA</div>
                      <div className="w-1/3 text-sm text-gray-500">
                        1 {locale === "pt" ? "dia atrás" : locale === "es" ? "día atrás" : "day ago"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="btn-secondary flex items-center text-sm">
                  <LogOut className="w-4 h-4 mr-1" />
                  {locale === "pt"
                    ? "Encerrar Todas as Sessões"
                    : locale === "es"
                      ? "Cerrar Todas las Sesiones"
                      : "Log Out All Sessions"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
