"use client"

import { ACCENT_COLOR, SURFACE, TEXT_COLOR } from "@/app/data/colors"
import AddIcon from "@mui/icons-material/Add"
import { Box, Button } from "@mui/material"
import { RefObject, useEffect, useState } from "react"

const SCROLL_THRESHOLD = 20

const AddButton = ({
  action,
  scrollContainerRef,
}: {
  action: () => void
  scrollContainerRef: RefObject<HTMLElement | null>
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return
    const handleScroll = () => {
      setIsCollapsed(scrollContainer.scrollTop > SCROLL_THRESHOLD)
    }
    handleScroll()
    scrollContainer.addEventListener("scroll", handleScroll, {
      passive: true,
    })
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [scrollContainerRef])

  return (
    <Button
      onClick={action}
      variant={"contained"}
      size={"small"}
      startIcon={<AddIcon sx={{ color: SURFACE }} />}
      sx={{
        position: "fixed",
        right: 8,
        bottom: 72,
        zIndex: 100,
        width: isCollapsed ? 40 : 168,
        minWidth: 40,
        height: 40,
        px: isCollapsed ? 0 : 1.5,
        borderRadius: 5,
        backgroundColor: ACCENT_COLOR,
        color: TEXT_COLOR,
        textTransform: "none",
        fontWeight: 600,
        fontSize: "0.85rem",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
        transition: "width 0.2s ease, padding 0.2s ease, transform 0.15s ease",
        "& .MuiButton-startIcon": { margin: 0, transition: "margin 0.2s ease" },
      }}
    >
      <Box
        component={"span"}
        sx={{
          maxWidth: isCollapsed ? 0 : 120,
          opacity: isCollapsed ? 0 : 1,
          overflow: "hidden",
          whiteSpace: "nowrap",
          color: SURFACE,
          transition: "max-width 0.2s ease, opacity 0.1s ease",
        }}
      >
        Add Transaction
      </Box>
    </Button>
  )
}

export default AddButton
