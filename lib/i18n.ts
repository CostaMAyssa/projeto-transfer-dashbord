// Arquivo para configuração de internacionalização

// Definição de tipos para as traduções
export type Locale = "en" | "es" | "pt"

// Interface para as traduções
export interface Translations {
  common: {
    dashboard: string
    trips: string
    vehicles: string
    drivers: string
    pricing: string
    reports: string
    settings: string
    save: string
    cancel: string
    search: string
    loading: string
    newReservation: string
  }
  dashboard: {
    totalBookings: string
    activeVehicles: string
    activeDrivers: string
    totalRevenue: string
    calendar: string
    recentBookings: string
    upcomingBookings: string
    alerts: string
  }
  settings: {
    general: string
    notifications: string
    security: string
    privacy: string
    billing: string
    email: string
    language: string
    timeZone: string
    dateFormat: string
    currency: string
    companyInfo: string
    companyName: string
    businessEmail: string
    phoneNumber: string
    website: string
  }
  reports: {
    title: string
    subtitle: string
    today: string
    yesterday: string
    last7Days: string
    last30Days: string
    last90Days: string
    thisMonth: string
    lastMonth: string
    custom: string
    refresh: string
    export: string
    filter: string
    totalRevenue: string
    totalTrips: string
    newCustomers: string
    avgTrip: string
    avgTripTime: string
    customerSatisfaction: string
    vsPrevious: string
    vsLastMonth: string
    revenueByPeriod: string
    revenueEvolution: string
    viewDetails: string
    chartPlaceholder: string
    daily: string
    weekly: string
    monthly: string
    revenueChartPlaceholder: string
    tripsByCategory: string
    categoryChartPlaceholder: string
    mostUsedVehicles: string
    viewAll: string
    trips: string
    driverPerformance: string
    recentTrips: string
    client: string
    origin: string
    destination: string
    date: string
    amount: string
    status: string
    completed: string
    inProgress: string
    scheduled: string
    pending: string
    cancelled: string
  }
}

// Traduções em inglês (padrão)
export const en: Translations = {
  common: {
    dashboard: "Dashboard",
    trips: "Trips",
    vehicles: "Vehicles",
    drivers: "Drivers",
    pricing: "Pricing",
    reports: "Reports",
    settings: "Settings",
    save: "Save",
    cancel: "Cancel",
    search: "Search...",
    loading: "Loading...",
    newReservation: "New Reservation",
  },
  dashboard: {
    totalBookings: "Total Bookings",
    activeVehicles: "Active Vehicles",
    activeDrivers: "Active Drivers",
    totalRevenue: "Total Revenue",
    calendar: "Calendar",
    recentBookings: "Recent Bookings",
    upcomingBookings: "Upcoming Bookings",
    alerts: "Alerts & Notifications",
  },
  settings: {
    general: "General",
    notifications: "Notifications",
    security: "Security",
    privacy: "Privacy",
    billing: "Billing",
    email: "Email",
    language: "Language",
    timeZone: "Time Zone",
    dateFormat: "Date Format",
    currency: "Currency",
    companyInfo: "Company Information",
    companyName: "Company Name",
    businessEmail: "Business Email",
    phoneNumber: "Phone Number",
    website: "Website",
  },
  reports: {
    title: "Reports",
    subtitle: "View metrics and trends for your business",
    today: "Today",
    yesterday: "Yesterday",
    last7Days: "Last 7 days",
    last30Days: "Last 30 days",
    last90Days: "Last 90 days",
    thisMonth: "This month",
    lastMonth: "Last month",
    custom: "Custom",
    refresh: "Refresh",
    export: "Export",
    filter: "Filter",
    totalRevenue: "Total Revenue",
    totalTrips: "Total Trips",
    newCustomers: "New Customers",
    avgTrip: "Average Trip",
    avgTripTime: "Average Trip Time",
    customerSatisfaction: "Customer Satisfaction",
    vsPrevious: "vs. previous period",
    vsLastMonth: "vs. last month",
    revenueByPeriod: "Revenue by Period",
    revenueEvolution: "Revenue Evolution",
    viewDetails: "View Details",
    chartPlaceholder: "Chart placeholder",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    revenueChartPlaceholder: "Revenue chart will be displayed here",
    tripsByCategory: "Trips by Category",
    categoryChartPlaceholder: "Category chart will be displayed here",
    mostUsedVehicles: "Most Used Vehicles",
    viewAll: "View all",
    trips: "trips",
    driverPerformance: "Driver Performance",
    recentTrips: "Recent Trips",
    client: "Client",
    origin: "Origin",
    destination: "Destination",
    date: "Date",
    amount: "Amount",
    status: "Status",
    completed: "Completed",
    inProgress: "In Progress",
    scheduled: "Scheduled",
    pending: "Pending",
    cancelled: "Cancelled",
  },
}

// Traduções em espanhol
export const es: Translations = {
  common: {
    dashboard: "Panel",
    trips: "Viajes",
    vehicles: "Vehículos",
    drivers: "Conductores",
    pricing: "Precios",
    reports: "Informes",
    settings: "Configuración",
    save: "Guardar",
    cancel: "Cancelar",
    search: "Buscar...",
    loading: "Cargando...",
    newReservation: "Nueva Reserva",
  },
  dashboard: {
    totalBookings: "Reservas Totales",
    activeVehicles: "Vehículos Activos",
    activeDrivers: "Conductores Activos",
    totalRevenue: "Ingresos Totales",
    calendar: "Calendario",
    recentBookings: "Reservas Recientes",
    upcomingBookings: "Próximas Reservas",
    alerts: "Alertas y Notificaciones",
  },
  settings: {
    general: "General",
    notifications: "Notificaciones",
    security: "Seguridad",
    privacy: "Privacidad",
    billing: "Facturación",
    email: "Correo Electrónico",
    language: "Idioma",
    timeZone: "Zona Horaria",
    dateFormat: "Formato de Fecha",
    currency: "Moneda",
    companyInfo: "Información de la Empresa",
    companyName: "Nombre de la Empresa",
    businessEmail: "Correo Electrónico de Negocios",
    phoneNumber: "Número de Teléfono",
    website: "Sitio Web",
  },
  reports: {
    title: "Informes",
    subtitle: "Ver métricas y tendencias para su negocio",
    today: "Hoy",
    yesterday: "Ayer",
    last7Days: "Últimos 7 días",
    last30Days: "Últimos 30 días",
    last90Days: "Últimos 90 días",
    thisMonth: "Este mes",
    lastMonth: "Mes pasado",
    custom: "Personalizado",
    refresh: "Actualizar",
    export: "Exportar",
    filter: "Filtrar",
    totalRevenue: "Ingresos Totales",
    totalTrips: "Viajes Totales",
    newCustomers: "Nuevos Clientes",
    avgTrip: "Viaje Promedio",
    avgTripTime: "Tiempo Medio de Viaje",
    customerSatisfaction: "Satisfacción del Cliente",
    vsPrevious: "vs. período anterior",
    vsLastMonth: "vs. mes pasado",
    revenueByPeriod: "Ingresos por Período",
    revenueEvolution: "Evolución de Ingresos",
    viewDetails: "Ver Detalles",
    chartPlaceholder: "Gráfico de referencia",
    daily: "Diario",
    weekly: "Semanal",
    monthly: "Mensual",
    revenueChartPlaceholder: "El gráfico de ingresos se mostrará aquí",
    tripsByCategory: "Viajes por Categoría",
    categoryChartPlaceholder: "El gráfico de categorías se mostrará aquí",
    mostUsedVehicles: "Vehículos Más Utilizados",
    viewAll: "Ver todos",
    trips: "viajes",
    driverPerformance: "Rendimiento de Conductores",
    recentTrips: "Viajes Recientes",
    client: "Cliente",
    origin: "Origen",
    destination: "Destino",
    date: "Fecha",
    amount: "Importe",
    status: "Estado",
    completed: "Completado",
    inProgress: "En Progreso",
    scheduled: "Programado",
    pending: "Pendiente",
    cancelled: "Cancelado",
  },
}

// Traduções em português
export const pt: Translations = {
  common: {
    dashboard: "Painel",
    trips: "Viagens",
    vehicles: "Veículos",
    drivers: "Motoristas",
    pricing: "Preços",
    reports: "Relatórios",
    settings: "Configurações",
    save: "Salvar",
    cancel: "Cancelar",
    search: "Pesquisar...",
    loading: "Carregando...",
    newReservation: "Nova Reserva",
  },
  dashboard: {
    totalBookings: "Total de Reservas",
    activeVehicles: "Veículos Ativos",
    activeDrivers: "Motoristas Ativos",
    totalRevenue: "Receita Total",
    calendar: "Calendário",
    recentBookings: "Reservas Recentes",
    upcomingBookings: "Próximas Reservas",
    alerts: "Alertas e Notificações",
  },
  settings: {
    general: "Geral",
    notifications: "Notificações",
    security: "Segurança",
    privacy: "Privacidade",
    billing: "Faturamento",
    email: "E-mail",
    language: "Idioma",
    timeZone: "Fuso Horário",
    dateFormat: "Formato de Data",
    currency: "Moeda",
    companyInfo: "Informações da Empresa",
    companyName: "Nome da Empresa",
    businessEmail: "E-mail Comercial",
    phoneNumber: "Número de Telefone",
    website: "Site",
  },
  reports: {
    title: "Relatórios",
    subtitle: "Visualize métricas e tendências do seu negócio",
    today: "Hoje",
    yesterday: "Ontem",
    last7Days: "Últimos 7 dias",
    last30Days: "Últimos 30 dias",
    last90Days: "Últimos 90 dias",
    thisMonth: "Este mês",
    lastMonth: "Mês passado",
    custom: "Personalizado",
    refresh: "Atualizar",
    export: "Exportar",
    filter: "Filtrar",
    totalRevenue: "Receita Total",
    totalTrips: "Total de Viagens",
    newCustomers: "Novos Clientes",
    avgTrip: "Viagem Média",
    avgTripTime: "Tempo Médio de Viagem",
    customerSatisfaction: "Satisfação do Cliente",
    vsPrevious: "vs. período anterior",
    vsLastMonth: "vs. mês anterior",
    revenueByPeriod: "Receita por Período",
    revenueEvolution: "Evolução de Receita",
    viewDetails: "Ver Detalhes",
    chartPlaceholder: "Gráfico de referência",
    daily: "Diário",
    weekly: "Semanal",
    monthly: "Mensal",
    revenueChartPlaceholder: "Gráfico de receita será exibido aqui",
    tripsByCategory: "Viagens por Categoria",
    categoryChartPlaceholder: "Gráfico de categorias será exibido aqui",
    mostUsedVehicles: "Veículos Mais Utilizados",
    viewAll: "Ver todos",
    trips: "viagens",
    driverPerformance: "Desempenho dos Motoristas",
    recentTrips: "Viagens Recentes",
    client: "Cliente",
    origin: "Origem",
    destination: "Destino",
    date: "Data",
    amount: "Valor",
    status: "Status",
    completed: "Concluída",
    inProgress: "Em andamento",
    scheduled: "Agendada",
    pending: "Pendente",
    cancelled: "Cancelada",
  },
}

// Função para obter as traduções com base no idioma selecionado
export function getTranslations(locale: Locale): Translations {
  switch (locale) {
    case "es":
      return es
    case "pt":
      return pt
    default:
      return en
  }
}
