"use client"

import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useRef } from "react"
import { useTransactionContext } from "../contexts/transaction-context"
import { ACCENT_COLOR } from "../data/colors"
import { NAVIGATION } from "../data/navigation"
import AllDialogs from "./AllDialogs"
import AddButton from "./ui/AddButton"
import AlertToast from "./ui/AlertToast"

export default function AppShell({ children }: { children: ReactNode }) {
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { setOpenNewTransactionDialog, alertToast, moneyInputRef } =
    useTransactionContext()
  const activeIndex = NAVIGATION.findIndex((item) => item.href === pathname)

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <Box
        component={"main"}
        ref={scrollContainerRef}
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflowY: "auto",
          overflowX: "hidden",
          color: "text.primary",
          scrollbarWidth: "none",
          paddingBottom: "48px",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {children}
      </Box>

      <BottomNavigation
        value={activeIndex >= 0 ? activeIndex : 0}
        onChange={(_, index) => router.push(NAVIGATION[index].href)}
        sx={{
          flexShrink: 0,
          height: 80,
          borderTop: 1,
          paddingTop: 1,
          borderColor: "divider",
          alignItems: "start",
        }}
      >
        {NAVIGATION.map((item) => (
          <BottomNavigationAction
            disableRipple
            showLabel
            key={item.href}
            label={item.label}
            icon={item.icon}
            sx={{ "&.Mui-selected": { color: ACCENT_COLOR } }}
          />
        ))}
      </BottomNavigation>

      {pathname !== "/settings" && (
        <AddButton
          action={() => {
            setOpenNewTransactionDialog(true)
            setTimeout(() => moneyInputRef.current?.focus(), 50)
          }}
          scrollContainerRef={scrollContainerRef}
        />
      )}

      <AlertToast alertToast={alertToast} />
      <AllDialogs />
    </Box>
  )
}
