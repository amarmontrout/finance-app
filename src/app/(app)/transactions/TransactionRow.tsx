import { formattedStringNumber } from "@/utils/helperFunctions"
import {
  TransactionTypeV2,
  SelectedTransactionType,
  HookSetter,
} from "@/utils/type"
import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useRef, useState } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import EditIcon from "@mui/icons-material/Edit"
import { darkMode, lightMode } from "@/globals/colors"

const EditDeleteButton = ({
  id,
  type,
  setOpenEditDialog,
  setSelectedTransaction,
}: {
  id: number
  type: "income" | "expense"
  setOpenEditDialog: HookSetter<boolean>
  setSelectedTransaction: HookSetter<SelectedTransactionType | null>
}) => {
  return (
    <Stack direction={"row"} gap={2} sx={{ flexShrink: 0 }}>
      <IconButton
        size="small"
        onClick={() => {
          setOpenEditDialog(true)
          setSelectedTransaction({ id: id, type: type })
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => {
          setSelectedTransaction({ id: id, type: type })
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  )
}

const ConfirmCancelButton = ({
  id,
  type,
  handleDeleteTransaction,
  setSelectedTransaction,
}: {
  id: number
  type: "income" | "expense"
  handleDeleteTransaction: (
    id: number,
    type: "income" | "expense",
  ) => Promise<void>
  setSelectedTransaction: HookSetter<SelectedTransactionType | null>
}) => {
  return (
    <Stack direction={"row"} gap={2}>
      <IconButton
        size="small"
        onClick={() => {
          handleDeleteTransaction(id, type)
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => {
          setSelectedTransaction(null)
        }}
      >
        <CancelIcon fontSize="small" />
      </IconButton>
    </Stack>
  )
}

const TransactionRow = ({
  transaction,
  type,
  selectedTransaction,
  setSelectedTransaction,
  openEditDialog,
  setOpenEditDialog,
  handleDeleteTransaction,
  selectedMonth,
  selectedYear,
  currentTheme,
}: {
  transaction: TransactionTypeV2
  type: "income" | "expense"
  selectedTransaction: SelectedTransactionType | null
  setSelectedTransaction: HookSetter<SelectedTransactionType | null>
  openEditDialog: boolean
  setOpenEditDialog: HookSetter<boolean>
  handleDeleteTransaction: (
    id: number,
    type: "income" | "expense",
  ) => Promise<void>
  selectedMonth: string
  selectedYear: number
  currentTheme: string | undefined
}) => {
  const startEdgeRef = useRef<"left" | "right" | null>(null)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const gestureLockRef = useRef<"horizontal" | "vertical" | null>(null)

  const [offset, setOffset] = useState(0)
  const [isActioning, setIsActioning] = useState(false)

  const EDGE_WIDTH = 100
  const SWIPE_THRESHOLD = 100
  const DIRECTION_THRESHOLD = 10
  const listItemColor =
    currentTheme === "light" ? lightMode.elevatedBg : darkMode.elevatedBg

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
      if (startEdgeRef.current === "left") {
        setOffset(Math.max(0, Math.min(deltaX, 110)))
      }

      if (startEdgeRef.current === "right") {
        setOffset(Math.min(0, Math.max(deltaX, -110)))
      }
    }
  }

  const handleTouchEnd = async () => {
    if (isActioning) return

    if (offset <= -SWIPE_THRESHOLD) {
      setIsActioning(true)
      await handleDeleteTransaction(transaction.id, type)
    } else if (offset >= SWIPE_THRESHOLD) {
      setIsActioning(true)
      setOpenEditDialog(true)
      setSelectedTransaction({ id: transaction.id, type })
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
            <Typography fontWeight={700}>{transaction.category}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography
              fontSize="1.2rem"
              color={type === "income" ? "success.main" : "error.main"}
            >
              ${formattedStringNumber(transaction.amount)}
            </Typography>

            <Box className="hidden sm:flex">
              {selectedTransaction?.id === transaction.id && !openEditDialog ? (
                <ConfirmCancelButton
                  id={transaction.id}
                  type={type}
                  handleDeleteTransaction={handleDeleteTransaction}
                  setSelectedTransaction={setSelectedTransaction}
                />
              ) : (
                <EditDeleteButton
                  id={transaction.id}
                  type={type}
                  setOpenEditDialog={setOpenEditDialog}
                  setSelectedTransaction={setSelectedTransaction}
                />
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
export default TransactionRow
