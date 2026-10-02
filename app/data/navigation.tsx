import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import HomeIcon from "@mui/icons-material/Home"
import ReceiptIcon from "@mui/icons-material/Receipt"
import SettingsIcon from "@mui/icons-material/Settings"
import { ReactNode } from "react"

type NavigationType = {
  label: string
  href: string
  icon: ReactNode
}

export const NAVIGATION: NavigationType[] = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon />,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: <ReceiptIcon />,
  },
  {
    label: "Budget",
    href: "/budget",
    icon: <AccountBalanceWalletIcon />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <SettingsIcon />,
  },
]
