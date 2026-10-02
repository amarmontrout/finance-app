import {
  BACKGROUND,
  NEGATIVE_COLOR,
  POSITIVE_COLOR,
  TEXT_COLOR,
} from "@/app/data/colors"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { Box, Stack, Typography } from "@mui/material"

import { memo, useRef, useState } from "react"

const ListItemSwipe = ({
  icon,
  mainTitle,
  secondaryTitle,
  categoryColor,
  amount,
  amountColor,
  onDelete,
  onEdit,
  noEdit,
  hasReturn,
  returnedAmount,
}: {
  icon?: React.ReactNode
  mainTitle: string
  secondaryTitle: string
  categoryColor: string | null | undefined
  amount: string
  amountColor: string
  onDelete: () => Promise<void>
  onEdit: () => void
  noEdit?: boolean
  hasReturn?: boolean
  returnedAmount?: string
}) => {
  const startEdgeRef = useRef<"left" | "right" | null>(null)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const gestureLockRef = useRef<"horizontal" | "vertical" | null>(null)

  const [offset, setOffset] = useState(0)
  const [isActioning, setIsActioning] = useState(false)

  const EDGE_WIDTH = 50
  const SWIPE_DISTANCE = 110
  // Prevent accidental swipes while scrolling. Higher threshold less sensitive
  const DIRECTION_THRESHOLD = 15
  const HORIZONTAL_BIAS = 1.3

  const isDeleteActive = offset <= -SWIPE_DISTANCE
  const isEditActive = offset >= SWIPE_DISTANCE

  const getResistedOffset = (delta: number) => {
    const direction = Math.sign(delta)
    const distance = Math.abs(delta)

    if (distance <= SWIPE_DISTANCE) {
      return delta
    }

    const excess = distance - SWIPE_DISTANCE
    const resistedExcess = excess * 0.25

    return direction * (SWIPE_DISTANCE + resistedExcess)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    const element = e.currentTarget.getBoundingClientRect()

    const touchX = touch.clientX
    const touchY = touch.clientY

    const isLeftEdge = touchX - element.left <= EDGE_WIDTH
    const isRightEdge = element.right - touchX <= EDGE_WIDTH

    if (!isLeftEdge && !isRightEdge) {
      startEdgeRef.current = null
      return
    }

    startEdgeRef.current = isLeftEdge ? "left" : "right"

    startXRef.current = touchX
    startYRef.current = touchY
    gestureLockRef.current = null
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startEdgeRef.current) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - startXRef.current
    const deltaY = touch.clientY - startYRef.current

    // Determine gesture direction once movement is significant
    if (!gestureLockRef.current) {
      if (
        Math.abs(deltaX) > DIRECTION_THRESHOLD ||
        Math.abs(deltaY) > DIRECTION_THRESHOLD
      ) {
        if (Math.abs(deltaX) > Math.abs(deltaY) * HORIZONTAL_BIAS) {
          gestureLockRef.current = "horizontal"
        } else {
          gestureLockRef.current = "vertical"
        }
      }
    }

    // Vertical gesture → let the browser scroll normally
    if (gestureLockRef.current === "vertical") {
      return
    }

    // Horizontal gesture → prevent vertical scrolling
    if (gestureLockRef.current === "horizontal") {
      e.preventDefault()

      if (startEdgeRef.current === "left") {
        if (noEdit) {
          setOffset(0)
        } else {
          setOffset(Math.min(getResistedOffset(deltaX), SWIPE_DISTANCE + 40))
        }
      } else {
        setOffset(Math.max(getResistedOffset(deltaX), -(SWIPE_DISTANCE + 40)))
      }
    }
  }

  const handleTouchEnd = async () => {
    if (isActioning) return

    if (offset <= -SWIPE_DISTANCE) {
      setIsActioning(true)
      await onDelete()
    } else if (!noEdit && offset >= SWIPE_DISTANCE) {
      setIsActioning(true)
      onEdit()
    }

    setOffset(0)
    startEdgeRef.current = null
    gestureLockRef.current = null
    setIsActioning(false)
  }

  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 0.5,
        borderLeft: `3px solid ${categoryColor ?? TEXT_COLOR}`,
        borderRight: `3px solid ${categoryColor ?? TEXT_COLOR}`,
      }}
    >
      {/* Shared height container */}
      <Box sx={{ position: "relative" }}>
        {/* Background layer */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          {/* Left edit */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: isEditActive ? "100%" : Math.max(0, offset),
              bgcolor: POSITIVE_COLOR,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              color: TEXT_COLOR,
              overflow: "hidden",
              transition: isEditActive ? "width 0.5s ease" : "none",
            }}
          >
            <EditIcon
              sx={{
                transform: isEditActive ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.15s ease",
                ml: 2,
              }}
            />
          </Box>

          {/* Right delete */}
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: isDeleteActive ? "100%" : Math.max(0, -offset),
              bgcolor: NEGATIVE_COLOR,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              color: TEXT_COLOR,
              overflow: "hidden",
              transition: isDeleteActive ? "width 0.5s ease" : "none",
            }}
          >
            <DeleteIcon
              sx={{
                transform: isDeleteActive ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.15s ease",
                mr: 2,
              }}
            />
          </Box>
        </Box>

        {/* Foreground content */}
        <Stack
          direction={"row"}
          sx={{
            position: "relative",
            zIndex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            px: 0.5,
            py: 0.5,
            transform: `translate3d(${offset}px,0,0)`,
            transition: offset === 0 ? "transform 0.2s ease" : "none",
            touchAction: "pan-y",
            willChange: "transform",
            backgroundColor: icon ? `rgba(255, 255, 255, 0.05)` : undefined,
          }}
        >
          <Stack
            direction={"row"}
            spacing={1}
            sx={{ width: "100%", alignItems: "center" }}
          >
            {icon && icon}

            <Stack direction={"column"} spacing={0.25}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  lineHeight: secondaryTitle === "" ? "36px" : "20px",
                }}
              >
                {mainTitle}
              </Typography>

              <Stack direction={"row"} spacing={1}>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    lineHeight: "16px",
                    width: "fit-content",
                    paddingX: 0.75,
                    color: BACKGROUND,
                    borderRadius: 0.5,
                    backgroundColor: categoryColor ?? TEXT_COLOR,
                  }}
                >
                  {secondaryTitle}
                </Typography>

                {hasReturn && (
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      lineHeight: "16px",
                      color: POSITIVE_COLOR,
                    }}
                  >
                    ↩ {returnedAmount} returned
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Stack>

          <Stack direction={"row"} spacing={2} sx={{ minWidth: "fit-content" }}>
            <Typography
              sx={{
                fontSize: "1rem",
                color: amountColor,
                lineHeight: "36px",
                alignContent: "center",
              }}
            >
              {amount}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default memo(ListItemSwipe)
