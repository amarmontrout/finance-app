// Buttons, active tab/selected nav item, important graph highlights
export const accentColorPrimary = "#2563EB"
export const accentColorPrimarySelected = "#2563EB80"
export const accentColorPrimaryHover = "#2563EB40"
// Savings goals, positive cash flow, secondary buttons (CTA), graph comparison lines
export const accentColorSecondary = "#10B981"

export const incomeLinesLight = [
    "#16A34A", // green (primary)
    "#22C55E", // lime green
    "#047857", // dark teal green
    "#6EE7B7", // mint green
    "#166534"  // forest green
]

export const incomeLinesDark = [
    "#15803D", // deep green
    "#22C55E", // bright green
    "#4ADE80", // soft lime green
    "#14532D",  // dark forest green
    "#52B788", // muted green
]

export const expenseLinesLight = [
    "#DC2626", // red (primary)
    "#FCA5A5", // soft pink-red
    "#B91C1C", // dark red
    "#EF4444", // bright red
    "#7F1D1D"  // deep maroon
]

export const expenseLinesDark = [
    "#EF4444", // vivid red
    "#F87171", // soft coral
    "#991B1B", // dark crimson
    "#F05545", // muted red
    "#7F1D1D"  // deep maroon
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