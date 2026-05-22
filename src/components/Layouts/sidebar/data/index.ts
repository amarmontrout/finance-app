import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined"
import DataUsageOutlinedIcon from "@mui/icons-material/DataUsageOutlined"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"
import MultilineChartOutlinedIcon from "@mui/icons-material/MultilineChartOutlined"

export const NAV_DATA = [
  {
    label: "FINANCE APP",
    items: [
      {
        title: "Overview",
        icon: HomeOutlinedIcon,
        items: [
          {
            title: "Summary",
            url: "/",
          },
          {
            title: "Budget",
            url: "/progress",
          },
          {
            title: "Credit Card",
            url: "/estimate",
          },
        ],
      },
      {
        title: "Transactions",
        url: "/transactions",
        icon: AccountBalanceOutlinedIcon,
        items: [],
      },
      {
        title: "Budget",
        url: "/budget",
        icon: DataUsageOutlinedIcon,
        items: [],
      },
      {
        title: "Insights",
        icon: MultilineChartOutlinedIcon,
        items: [
          {
            title: "Dashboard",
            url: "/insights",
          },
          {
            title: "Top Expenses",
            url: "/insights/top-expenses",
          },
          {
            title: "Trends",
            url: "/insights/trends",
          },
        ],
      },
    ],
  },
]
