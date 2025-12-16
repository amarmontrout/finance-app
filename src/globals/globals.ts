import { PageLinkType } from "@/navigation/PageLink"
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PostAddIcon from '@mui/icons-material/PostAdd';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export const EXPENSES = "expenses"
export const INCOME = "income"
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]
export const YEARS = [
  "2024",
  "2025",
  "2026"
]
export const INCOME_CATEGORIES = [
  "Paycheck",
  "Savings Interest",
  "Misc"
]
export const EXPENSE_CATEGORIES = [
  "Mortgage",
  "Electric",
  "Internet",
  "Water",
  "Trash",
  "Phone",
  "Credit Card",
  "Misc"
]
export const NAV_QUICKINFO: PageLinkType[] = [
  {"name": "Overview", "link": "/", icon: InsightsIcon},
  {"name": "Income", "link": "/income", icon: TrendingUpIcon},
  {"name": "Expenses", "link": "/expenses", icon: TrendingDownIcon},
]
export const NAV_ACTIONS: PageLinkType[] = [
  {"name": "Transactions", "link": "/transactions", icon: PostAddIcon},
  {"name": "Set Goals", "link": "#", icon: EditDocumentIcon},
]
export const NAV_MISC: PageLinkType[] = [
  {"name": "Calendar", "link": "#", icon: CalendarMonthIcon},
]