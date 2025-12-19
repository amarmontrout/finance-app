import { PageLinkType } from "@/navigation/PageLink"
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SettingsIcon from '@mui/icons-material/Settings';

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
export const YEARS_KEY = "years"
export const INCOME_CATEGORIES_KEY = "incomeCategories"
export const EXPENSE_CATEGORIES_KEY = "expenseCategories"
export const NAV_QUICK_INFO: PageLinkType[] = [
  {"name": "Overview", "link": "/", icon: InsightsIcon},
  {"name": "Insights", "link": "/insights", icon: InsightsIcon},
  {"name": "Trends", "link": "/trends", icon: InsightsIcon},
  {"name": "Categories", "link": "/categories", icon: InsightsIcon}
]
export const NAV_TRANSACTIONS: PageLinkType[] = [
  {"name": "Income", "link": "/income", icon: TrendingUpIcon},
  {"name": "Expenses", "link": "/expenses", icon: TrendingDownIcon},
]
export const NAV_SETTINGS: PageLinkType[] = [
  {"name": "Settings", "link": "/settings", icon: SettingsIcon}
]