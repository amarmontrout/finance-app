import { PageLinkType } from "@/navigation/PageLink"
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SettingsIcon from '@mui/icons-material/Settings';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import MultilineChartIcon from '@mui/icons-material/MultilineChart';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import PaymentsIcon from '@mui/icons-material/Payments';

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
export const BUDGET_KEY = "budget"
export const NAV_QUICK_INFO: PageLinkType[] = [
  {"name": "Overview", "link": "/", icon: DataUsageIcon},
  {"name": "Insights", "link": "/insights", icon: InsightsIcon},
  {"name": "Trends", "link": "/trends", icon: MultilineChartIcon},
  {"name": "Categories", "link": "/categories", icon: WorkspacesIcon}
]
export const NAV_TRANSACTIONS: PageLinkType[] = [
  {"name": "Income", "link": "/income", icon: TrendingUpIcon},
  {"name": "Expenses", "link": "/expenses", icon: TrendingDownIcon},
  {"name": "Budget", "link": "/budget", icon: PaymentsIcon},
]
export const NAV_SETTINGS: PageLinkType[] = [
  {"name": "Settings", "link": "/settings", icon: SettingsIcon}
]