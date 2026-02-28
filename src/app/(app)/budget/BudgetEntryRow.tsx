import { BudgetTransactionTypeV2, HookSetter } from "@/utils/type"
import { Stack, IconButton, Box, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import EditIcon from "@mui/icons-material/Edit"
import { useRef, useState } from "react"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { darkMode, lightMode } from "@/globals/colors"

const EditDeleteButton = ({
  id,
  entry,
  setOpenEditDialog,
  setSelectedEntry,
  setNoteId,
}: {
  id: number
  entry: BudgetTransactionTypeV2
  setOpenEditDialog: HookSetter<boolean>
  setSelectedEntry: HookSetter<BudgetTransactionTypeV2 | null>
  setNoteId: HookSetter<number | null>
}) => {
  return (
    <Stack direction={"row"} gap={2}>
      <IconButton
        edge="end"
        onClick={() => {
          setOpenEditDialog(true)
          setSelectedEntry(entry)
        }}
      >
        <EditIcon />
      </IconButton>

      <IconButton
        edge="end"
        onClick={() => {
          setNoteId(id)
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  )
}

const ConfirmCancelButton = ({
  id,
  handleDeleteEntry,
  setNoteId,
  setSelectedEntry,
}: {
  id: number
  handleDeleteEntry: (id: number) => void
  setNoteId: HookSetter<number | null>
  setSelectedEntry: HookSetter<BudgetTransactionTypeV2 | null>
}) => {
  return (
    <Stack direction={"row"} gap={2}>
      <IconButton
        edge="end"
        onClick={() => {
          handleDeleteEntry(id)
          setNoteId(null)
        }}
      >
        <DeleteIcon />
      </IconButton>

      <IconButton
        edge="end"
        onClick={() => {
          setSelectedEntry(null)
          setNoteId(null)
        }}
      >
        <CancelIcon />
      </IconButton>
    </Stack>
  )
}

const BudgetEntryRow = ({
  entry,
  handleDeleteEntry,
  setOpenEditDialog,
  setSelectedEntry,
  currentTheme,
}: {
  entry: BudgetTransactionTypeV2
  handleDeleteEntry: (id: number) => Promise<void>
  setOpenEditDialog: HookSetter<boolean>
  setSelectedEntry: HookSetter<BudgetTransactionTypeV2 | null>
  currentTheme: string | undefined
}) => {
  const startEdgeRef = useRef<"left" | "right" | null>(null)
  const [startX, setStartX] = useState(0)
  const [offset, setOffset] = useState(0)
  const [isActioning, setIsActioning] = useState(false)
  const [isSwiping, setIsSwiping] = useState(false)
  const [noteId, setNoteId] = useState<number | null>(null)

  const EDGE_WIDTH = 100
  const listItemColor =
    currentTheme === "light" ? lightMode.elevatedBg : darkMode.elevatedBg
  const entryDate = `${entry.date.month} ${entry.date.day}, ${entry.date.year}`

  const handleTouchStart = (e: React.TouchEvent) => {
    const touchX = e.touches[0].clientX
    const element = e.currentTarget.getBoundingClientRect()

    const isLeftEdge = touchX - element.left <= EDGE_WIDTH
    const isRightEdge = element.right - touchX <= EDGE_WIDTH

    if (!isLeftEdge && !isRightEdge) {
      setIsSwiping(false)
      return
    }

    if (isLeftEdge) {
      startEdgeRef.current = "left"
    } else if (isRightEdge) {
      startEdgeRef.current = "right"
    } else {
      startEdgeRef.current = null
      return
    }

    setIsSwiping(true)
    setStartX(touchX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || !startEdgeRef.current) return

    const deltaX = e.touches[0].clientX - startX

    if (startEdgeRef.current === "left") {
      setOffset(Math.max(0, Math.min(deltaX, 110)))
    }

    if (startEdgeRef.current === "right") {
      setOffset(Math.min(0, Math.max(deltaX, -110)))
    }
  }

  const handleTouchEnd = async () => {
    if (!isSwiping || isActioning) return

    if (offset < -100) {
      setIsActioning(true)
      await handleDeleteEntry(entry.id)
    } else if (offset > 100) {
      setIsActioning(true)
      setOpenEditDialog(true)
      setSelectedEntry(entry)
    }

    setOffset(0)
    setIsSwiping(false)
    setIsActioning(false)
    startEdgeRef.current = null
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
            <Typography fontWeight={700}>{entry.note}</Typography>

            <Typography fontSize={12} color="text.secondary">
              {entryDate}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography
              fontSize="1.2rem"
              color={entry.isReturn ? "error.main" : "inherit"}
            >
              {`${entry.isReturn ? "-" : ""}$${formattedStringNumber(entry.amount)}`}
            </Typography>

            <Box className="hidden sm:flex">
              {noteId === entry.id ? (
                <ConfirmCancelButton
                  id={entry.id}
                  handleDeleteEntry={handleDeleteEntry}
                  setNoteId={setNoteId}
                  setSelectedEntry={setSelectedEntry}
                />
              ) : (
                <EditDeleteButton
                  id={entry.id}
                  entry={entry}
                  setOpenEditDialog={setOpenEditDialog}
                  setSelectedEntry={setSelectedEntry}
                  setNoteId={setNoteId}
                />
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default BudgetEntryRow
