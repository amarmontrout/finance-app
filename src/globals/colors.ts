// Buttons, active tab/selected nav item, important graph highlights
export const accentColorPrimary = "#2563EB"
export const accentColorPrimarySelected = "#2563EBB3"
export const accentColorPrimaryHover = "#2563EB40"
// Savings goals, positive cash flow, secondary buttons (CTA), graph comparison lines
export const accentColorSecondary = "#10B981"

export const incomeLinesLight = [
  "#1E40AF",
  "#0EA5E9",
  "#14532D",
  "#38BDF8",
  "#0F766E",
  "#22C55E",
  "#0284C7",
  "#14B8A6",
  "#312E81",
  "#10B981",
]

export const incomeLinesDark = [
  "#1D4ED8",
  "#0EA5E9",
  "#14B8A6",
  "#2563EB",
  "#06B6D4",
  "#4338CA",
  "#10B981",
  "#0284C7",
  "#2DD4BF",
  "#312E81",
]

export const expenseLinesLight = [
  "#7C2D12",
  "#F97316",
  "#B91C1C",
  "#FDBA74",
  "#DC2626",
  "#F59E0B",
  "#C2410C",
  "#FB7185",
  "#EA580C",
  "#FCA5A5",
]

export const expenseLinesDark = [
  "#FDBA74",
  "#FCA5A5",
  "#FB923C",
  "#F87171",
  "#FCD34D",
  "#FECDD3",
  "#F97316",
  "#FF6B6B",
  "#FBBF24",
  "#FF9F1C",
]

export enum lightMode {
    accentColorPrimary = "#2563EB",
    baseBg = "#F9FAFB", // App background
    surfaceBg = "#FFFFFF", // Cards holding content
    elevatedBg = "#F3F4F6", // Modals, sticky headers, input backgrounds
    primaryText = "#111827", // Actual content
    secondaryText = "#4B5563", // Labels, categories
    disabledText = "#9CA3AF", // Inactive UI
    borderMuted = "#E5E7EB", // Subtle divisions
    borderStrong = "#D1D5DB", // Focus outlines, important boundaries
    success = "#16A34A", // Payment recieved, positive budget
    warning = "#F59E0B", // Overspending approaching limit
    error = "#DC2626", // Invalid inputs, failed sync, negative cash flow
    graph1 = "#6B7280", 
    graph2 = "#9CA3AF", 
    graph3 = "#D1D5DB", 
}

export enum darkMode {
    accentColorPrimary = "#3B82F6",
    baseBg = "#0F172A", // App background
    surfaceBg = "#1E293B", // Cards holding content
    elevatedBg = "#334155", // Modals, sticky headers, input backgrounds
    primaryText = "#F1F5F9", // Actual content
    secondaryText = "#CBD5E1", // Labels, categories
    disabledText = "#64748B", // Inactive UI
    borderMuted = "#1E293B", // Subtle divisions
    borderStrong = "#475569", // Focus outlines, important boundaries
    success = "#22C55E", // Payment recieved, positive budget
    warning = "#FBBF24", // Overspending approaching limit
    error = "#EF4444", // Invalid inputs, failed sync, negative cash flow
    graph1 = "#E2E8F0", 
    graph2 = "#94A3B8", 
    graph3 = "#475569", 
}

export const healthStateLightMode = {
  concerning: {
    background: "#FDEAEA",
    textIcon: "#991B1B",
    border: "#DC2626",
  },
  ok: {
    background: "#FFF4E5",
    textIcon: "#9A3412",
    border: "#EA580C",
  },
  average: {
    background: "#FFFBEB",
    textIcon: "#92400E",
    border: "#F59E0B",
  },
  great: {
    background: "#ECFDF3",
    textIcon: "#027A48",
    border: "#22C55E",
  },
  excellent: {
    background: "#EFF6FF",
    textIcon: "#1D4ED8",
    border: "#3B82F6",
  },
  default: {
    background: lightMode.elevatedBg,
    textIcon: lightMode.primaryText,
    border: lightMode.borderStrong
  }
} as const


export const healthStateDarkMode = {
  concerning: {
    background: "#3A0F0F",
    textIcon: "#FCA5A5",
    border: "#EF4444",
  },
  ok: {
    background: "#3A1F0B",
    textIcon: "#FDBA74",
    border: "#FB923C",
  },
  average: {
    background: "#3A2A0B",
    textIcon: "#FCD34D",
    border: "#FBBF24",
  },
  great: {
    background: "#06281B",
    textIcon: "#6EE7B7",
    border: "#22C55E",
  },
  excellent: {
    background: "#0B1E3A",
    textIcon: "#93C5FD",
    border: "#3B82F6",
  },
  default: {
    background: darkMode.elevatedBg,
    textIcon: darkMode.primaryText,
    border: darkMode.borderStrong
  }
} as const
