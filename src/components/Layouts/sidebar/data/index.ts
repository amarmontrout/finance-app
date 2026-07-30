import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined"
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined"
import DataUsageOutlinedIcon from "@mui/icons-material/DataUsageOutlined"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"

export const NAV_DATA = [
  {
    label: "FINANCE APP",
    items: [
      {
        title: "Overview",
        url: "/",
        icon: HomeOutlinedIcon,
      },
      {
        title: "Transactions",
        url: "/transactions",
        icon: AccountBalanceOutlinedIcon,
      },
      {
        title: "Budget",
        url: "/budget",
        icon: DataUsageOutlinedIcon,
      },
      {
        title: "Profile",
        url: "/settings",
        icon: AccountBoxOutlinedIcon,
      },
      // {
      //   title: "Insights",
      //   icon: MultilineChartOutlinedIcon,
      //   items: [
      //     {
      //       title: "Dashboard",
      //       url: "/insights",
      //     },
      //     {
      //       title: "Top Expenses",
      //       url: "/insights/top-expenses",
      //     },
      //     {
      //       title: "Trends",
      //       url: "/insights/trends",
      //     },
      //   ],
      // },
    ],
  },
]
