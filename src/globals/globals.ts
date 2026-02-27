import { PageLinkType } from "@/navigation/PageLink"
import InsightsIcon from '@mui/icons-material/Insights'
import MultilineChartIcon from '@mui/icons-material/MultilineChart'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import PaymentsIcon from '@mui/icons-material/Payments'
import HomeIcon from '@mui/icons-material/Home'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]
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
export const NAV_QUICK_INFO: PageLinkType[] = [
  {"name": "Overview", "link": "/", icon: HomeIcon},
  // {"name": "Insights", "link": "/insights", icon: InsightsIcon},
  // {"name": "Trends", "link": "/trends", icon: MultilineChartIcon},
  // {"name": "Categories", "link": "/categories", icon: WorkspacesIcon}
]
export const NAV_TRANSACTIONS: PageLinkType[] = [
  {"name": "Transactions", "link": "/transactions", icon: AccountBalanceIcon},
  {"name": "Budget", "link": "/budget", icon: PaymentsIcon},
]
export const INITIAL_INCOME_CATEGORIES = [
  "Paycheck",
  "Bonus",
  "Side Hustle",
  "Dividends",
  "Interest",
  "Rental Income",
  "Captial Gains",
  "Gift",
  "Refund",
  "Cash"
]
export const INITIAL_EXPENSE_CATEGORIES = [
  "Mortgage",
  "Rent",
  "HOA",
  "Credit Card",
  "Electric",
  "Internet",
  "Phone",
  "Trash",
  "Water",
  "Car"
]