"use client"

import { useMemo, useState } from "react"
import BudgetEntries from "./BudgetEntries"
import { getCurrentDateInfo, getWeekBounds } from "@/utils/helperFunctions"
import EditBudgetEntryDialog from "./EditBudgetEntryDialog"
import { useTheme } from "next-themes"
import { Stack } from "@mui/material"
import { useTransactionContext } from "@/contexts/transactions-context"
import { useCategoryContext } from "@/contexts/categories-context"
import { AlertToastType, BudgetTransactionTypeV2, DateType } from "@/utils/type"
import { useUser } from "@/hooks/useUser"
import AddBudgetEntryDialog from "./AddBudgetEntryDialog"
import AddDataButton from "@/components/AddDataButton"
import WeekSelector from "@/components/WeekSelector"
import AlertToast from "@/components/AlertToast"

const Budget = () => {
  const { budgetTransactionsV2, refreshBudgetTransactionsV2, isLoading } =
    useTransactionContext()
  const { budgetCategoriesV2 } = useCategoryContext()
  const { theme: currentTheme } = useTheme()
  const user = useUser()
  const { currentYear, currentDay, currentMonth } = getCurrentDateInfo()

  const [weekOffset, setWeekOffset] = useState<number>(0)
  const [selectedEntry, setSelectedEntry] =
    useState<BudgetTransactionTypeV2 | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [openAddBudgetEntryDialog, setOpenAddBudgetEntryDialog] =
    useState<boolean>(false)
  const [noteId, setNoteId] = useState<number | null>(null)
  const [alertToast, setAlertToast] = useState<AlertToastType>()

  const TODAY: DateType = {
    month: currentMonth,
    day: currentDay,
    year: currentYear,
  }
  const week = getWeekBounds(TODAY, weekOffset)

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
    <Stack spacing={1.5}>
      <WeekSelector
        week={week}
        weekOffset={weekOffset}
        setWeekOffset={setWeekOffset}
      />

      <BudgetEntries
        budgetTransactions={weeklyTransactions}
        budgetCategories={budgetCategoriesV2}
        refreshBudgetTransactions={refreshBudgetTransactionsV2}
        setOpenEditDialog={setOpenEditDialog}
        setSelectedEntry={setSelectedEntry}
        noteId={noteId}
        setNoteId={setNoteId}
        currentTheme={currentTheme}
        isLoading={isLoading}
        setAlertToast={setAlertToast}
      />

      <AddBudgetEntryDialog
        openAddBudgetEntryDialog={openAddBudgetEntryDialog}
        setOpenAddBudgetEntryDialog={setOpenAddBudgetEntryDialog}
        budgetCategories={budgetCategoriesV2}
        today={TODAY}
        user={user}
        refreshBudgetTransactions={refreshBudgetTransactionsV2}
        notes={notes}
        setAlertToast={setAlertToast}
      />

      <EditBudgetEntryDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        notes={notes}
        budgetCategories={budgetCategoriesV2}
        selectedEntry={selectedEntry}
        refreshBudgetTransactions={refreshBudgetTransactionsV2}
        today={TODAY}
        setAlertToast={setAlertToast}
      />

      <AlertToast alertToast={alertToast} />

      <AddDataButton
        action={() => {
          setOpenAddBudgetEntryDialog(true)
        }}
      />
    </Stack>
  )
}

export default Budget
