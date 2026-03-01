import { Stack, IconButton, Box, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import EditIcon from "@mui/icons-material/Edit"
import { useRef, useState } from "react"
import { darkMode, lightMode } from "@/globals/colors"

const EditDeleteButton = ({
  onEdit,
  onSetDelete,
}: {
  onEdit: () => void
  onSetDelete: () => void
}) => {
  return (
    <Stack direction={"row"} gap={2}>
      <IconButton edge="end" onClick={onEdit}>
        <EditIcon />
      </IconButton>

      <IconButton edge="end" onClick={onSetDelete}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  )
}

const ConfirmCancelButton = ({
  onDelete,
  onCancelDelete,
}: {
  onDelete: () => void
  onCancelDelete: () => void
}) => {
  return (
    <Stack direction={"row"} gap={2}>
      <IconButton edge="end" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>

      <IconButton edge="end" onClick={onCancelDelete}>
        <CancelIcon />
      </IconButton>
    </Stack>
  )
}

const ListItemSwipe = ({
  mainTitle,
  secondaryTitle,
  amount,
  amountColor,
  buttonCondition,
  onDelete,
  onSetDelete,
  onCancelDelete,
  onEdit,
  currentTheme,
}: {
  mainTitle: string
  secondaryTitle: string
  amount: string
  amountColor: string
  buttonCondition: boolean
  onDelete: () => Promise<void>
  onSetDelete: () => void
  onCancelDelete: () => void
  onEdit: () => void
  currentTheme: string | undefined
}) => {
  const startEdgeRef = useRef<"left" | "right" | null>(null)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const gestureLockRef = useRef<"horizontal" | "vertical" | null>(null)
  const hasVibratedRef = useRef(false)

  const [offset, setOffset] = useState(0)
  const [isActioning, setIsActioning] = useState(false)

  const EDGE_WIDTH = 100
  const SWIPE_THRESHOLD = 100
  const DIRECTION_THRESHOLD = 10
  const listItemColor =
    currentTheme === "light" ? lightMode.elevatedBg : darkMode.elevatedBg

  const isDeleteActive = offset <= -SWIPE_THRESHOLD
  const isEditActive = offset >= SWIPE_THRESHOLD

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

    // Determine gesture direction once threshold exceeded
    if (!gestureLockRef.current) {
      if (
        Math.abs(deltaX) > DIRECTION_THRESHOLD ||
        Math.abs(deltaY) > DIRECTION_THRESHOLD
      ) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          gestureLockRef.current = "horizontal"
        } else {
          gestureLockRef.current = "vertical"
        }
      }
    }

    // If vertical scroll → ignore swipe
    if (gestureLockRef.current === "vertical") return

    // If horizontal → apply edge restriction
    if (gestureLockRef.current === "horizontal") {
      e.preventDefault()
      const newOffset =
        startEdgeRef.current === "left"
          ? Math.max(0, Math.min(deltaX, 110))
          : Math.min(0, Math.max(deltaX, -110))

      setOffset(newOffset)

      if (!hasVibratedRef.current) {
        if (newOffset <= -SWIPE_THRESHOLD || newOffset >= SWIPE_THRESHOLD) {
          navigator.vibrate?.(10)
          hasVibratedRef.current = true
        }
      }
    }
  }

  const handleTouchEnd = async () => {
    if (isActioning) return

    if (offset <= -SWIPE_THRESHOLD) {
      setIsActioning(true)
      await onDelete()
    } else if (offset >= SWIPE_THRESHOLD) {
      setIsActioning(true)
      onEdit()
    }

    setOffset(0)
    startEdgeRef.current = null
    gestureLockRef.current = null
    hasVibratedRef.current = false
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
        borderRadius: 2,
      }}
    >
      {/* Red delete background */}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 120,
          bgcolor: "error.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          opacity: offset < 0 ? Math.min(Math.abs(offset) / 100, 1) : 0,
          transform: isDeleteActive ? "scale(1.5)" : "scale(1)",
          transition: "transform 0.15s ease",
        }}
      >
        <DeleteIcon />
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 120,
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          opacity: offset > 0 ? Math.min(offset / 100, 1) : 0,
          transform: isEditActive ? "scale(1.5)" : "scale(1)",
          transition: "transform 0.15s ease",
        }}
      >
        <EditIcon />
      </Box>

      {/* Foreground content */}
      <Box
        sx={{
          transform: `translateX(${offset}px)`,
          transition: offset === 0 ? "transform 0.2s ease" : "none",
          touchAction: "pan-y",
          willChange: "transform",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1.5,
            bgcolor: listItemColor,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Stack>
            <Typography fontWeight={700}>{mainTitle}</Typography>

            <Typography fontSize={12} color="text.secondary">
              {secondaryTitle}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography fontSize="1.2rem" color={amountColor}>
              {amount}
            </Typography>

            <Box className="hidden sm:flex">
              {buttonCondition ? (
                <ConfirmCancelButton
                  onDelete={onDelete}
                  onCancelDelete={onCancelDelete}
                />
              ) : (
                <EditDeleteButton onEdit={onEdit} onSetDelete={onSetDelete} />
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default ListItemSwipe
