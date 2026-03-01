"use client"

import { FlexColWrapper } from "@/components/Wrappers"
import { useMemo, useState } from "react"
import BudgetEntries from "./BudgetEntries"
import { getCurrentDateInfo, getWeekBounds } from "@/utils/helperFunctions"
import EditBudgetEntryDialog from "./EditBudgetEntryDialog"
import { useTheme } from "next-themes"
import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useTransactionContext } from "@/contexts/transactions-context"
import { useCategoryContext } from "@/contexts/categories-context"
import { BudgetTransactionTypeV2, DateType } from "@/utils/type"
import { useUser } from "@/hooks/useUser"
import AddBudgetEntryDialog from "./AddBudgetEntryDialog"
import {
  accentColorPrimary,
  accentColorPrimarySelected,
} from "@/globals/colors"
import AddIcon from "@mui/icons-material/Add"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"

const Budget = () => {
  const { budgetTransactionsV2, refreshBudgetTransactionsV2, isLoading } =
    useTransactionContext()
  const { budgetCategoriesV2 } = useCategoryContext()
  const { theme: currentTheme } = useTheme()
  const user = useUser()
  const { currentYear, currentDay, currentMonth } = getCurrentDateInfo()
  const TODAY: DateType = {
    month: currentMonth,
    day: currentDay,
    year: currentYear,
  }

  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedEntry, setSelectedEntry] =
    useState<BudgetTransactionTypeV2 | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [openAddBudgetEntryDialog, setOpenAddBudgetEntryDialog] =
    useState<boolean>(false)
  const [noteId, setNoteId] = useState<number | null>(null)

  const week = getWeekBounds(TODAY, weekOffset)

  const currentWeek = {
    start: `${week.start.month} ${week.start.day}`,
    end: `${week.end.month} ${week.end.day}`,
  }

  const notes = useMemo(() => {
    return [...new Set(budgetTransactionsV2.map((e) => e.note))]
  }, [budgetTransactionsV2])

  const weeklyTransactions = useMemo(() => {
    const toDate = (date: DateType) => {
      const monthIndex = new Date(`${date.month} 1, ${date.year}`).getMonth()
      return new Date(date.year, monthIndex, date.day)
    }

    const weekStart = toDate(week.start)
    const weekEnd = toDate(week.end)

    return budgetTransactionsV2.filter((entry) => {
      if (!entry.date?.day) return false

      const entryDate = toDate(entry.date)

      return entryDate >= weekStart && entryDate <= weekEnd
    })
  }, [budgetTransactionsV2, week.start, week.end])

  return (
    <FlexColWrapper gap={3}>
      <Box
        height={"48px"}
        borderBottom={`1px solid ${accentColorPrimarySelected}`}
        alignContent={"center"}
      >
        <Typography variant={"h6"}>Budget Entries</Typography>
      </Box>

      <IconButton
        onClick={() => {
          setOpenAddBudgetEntryDialog(true)
        }}
        size="large"
        disableRipple
        sx={{
          position: "fixed",
          right: "20px",
          top: "78px",
          backgroundColor: accentColorPrimary,
          color: "white",
          zIndex: 100,
          boxShadow: `
            0 6px 12px rgba(0,0,0,0.18),
            0 12px 24px rgba(0,0,0,0.18),
            inset 0 1px 0 rgba(255,255,255,0.25)
          `,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&:active": {
            boxShadow: `
              0 3px 6px rgba(0,0,0,0.25),
              inset 0 3px 6px rgba(0,0,0,0.25)
            `,
          },
        }}
      >
        <AddIcon />
      </IconButton>

      <Box className="flex flex-col sm:flex-row gap-3 h-full">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={"space-between"}
        >
          <IconButton onClick={() => setWeekOffset((w) => w - 1)}>
            <ChevronLeftIcon />
          </IconButton>

          <Typography onClick={() => setWeekOffset(0)}>
            {currentWeek.start} – {currentWeek.end}
          </Typography>

          <IconButton
            onClick={() => setWeekOffset((w) => w + 1)}
            disabled={weekOffset === 0}
          >
            <ChevronRightIcon />
          </IconButton>
        </Stack>
      </Box>

      <hr style={{ width: "100%" }} />

      <BudgetEntries
        budgetTransactions={weeklyTransactions}
        refreshBudgetTransactions={refreshBudgetTransactionsV2}
        setOpenEditDialog={setOpenEditDialog}
        setSelectedEntry={setSelectedEntry}
        noteId={noteId}
        setNoteId={setNoteId}
        currentTheme={currentTheme}
        isLoading={isLoading}
      />

      <AddBudgetEntryDialog
        openAddBudgetEntryDialog={openAddBudgetEntryDialog}
        setOpenAddBudgetEntryDialog={setOpenAddBudgetEntryDialog}
        budgetCategories={budgetCategoriesV2}
        today={TODAY}
        user={user}
        refreshBudgetTransactions={refreshBudgetTransactionsV2}
        notes={notes}
      />

      <EditBudgetEntryDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        notes={notes}
        budgetCategories={budgetCategoriesV2}
        selectedEntry={selectedEntry}
        refreshBudgetTransactions={refreshBudgetTransactionsV2}
        today={TODAY}
      />
    </FlexColWrapper>
  )
}

export default Budget
