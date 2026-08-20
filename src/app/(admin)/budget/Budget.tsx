"use client"

import { V2TransactionType } from "@/api/v2/models"
import { getTransactionsV2 } from "@/api/v2/requests"
import { useDataContext } from "@/contexts/data-context"
import AlertToast from "@/global/components/AlertToast"
import MonthYearSelector from "@/global/components/MonthYearSelector"
import { getNextMonthYear } from "@/global/infoFunctions"
import { AlertToastType } from "@/types/types"
import { Stack } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import BudgetTransactions from "./BudgetTransactions"

const Budget = () => {
  const { categories } = useDataContext()
  // const { isLoading, transactions, refreshTransactions } =
  //   useTransactionContext()
  // const {
  //   incomeCategories,
  //   expenseCategories,
  //   budgetCategories,
  //   loadCategories,
  // } = useCategoryContext()
  // const { today, passedMonths, currentMonthString } = getCurrentDateInfo()
  const inputRef = useRef<HTMLInputElement | null>(null)

  // const CURRENT_DATE = {
  //   month: today.month,
  //   year: today.year,
  // }

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  // const [selectedTransaction, setSelectedTransaction] =
  //   useState<TransactionType | null>(null)
  // const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  // const [openBudgetDialog, setOpenBudgetDialog] = useState<boolean>(false)
  const [alertToast, setAlertToast] = useState<AlertToastType>()
  // const [type, setType] = useState<"income" | "expense">("expense")
  // const [confirmSelection, setConfirmSelection] = useState<BudgetType | null>(
  //   null,
  // )
  // const [budgetEditDialogOpen, setBudgetEditDialogOpen] =
  //   useState<boolean>(false)
  // const [confirmEdit, setConfirmEdit] = useState<BudgetType | null>(null)
  const [monthExpenseTransactions, setMonthExpenseTransactions] = useState<
    V2TransactionType[]
  >([])

  const loadTransactions = async () => {
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0")

    const currMonthYear = `${year}-${month}`
    const nextMonthYear = getNextMonthYear({
      isoString: `${currMonthYear}-01`,
    })

    const transactions = await getTransactionsV2({
      filters: [
        {
          column: "transaction_date",
          operator: "gte",
          value: `${currMonthYear}-01`,
        },
        {
          column: "transaction_date",
          operator: "lt",
          value: `${nextMonthYear}-01`,
        },
        {
          column: "transaction_type",
          operator: "eq",
          value: "Expense",
        },
      ],
    })

    setMonthExpenseTransactions(transactions ?? [])
  }

  useEffect(() => {
    loadTransactions()
  }, [selectedDate])

  const resetSelectedDate = () => {
    setSelectedDate(new Date())
  }

  // const recommendedCategoryBudget = useMemo(() => {
  //   if (!confirmEdit || passedMonths.length === 0) return

  //   const isFirstMonth = passedMonths.length === 1
  //   const targetYear = isFirstMonth ? today.year - 1 : today.year

  //   const targetYearTransactions = getTransactionsByDate({
  //     transactions,
  //     year: targetYear,
  //   })

  //   const priorMonthsTransactions = targetYearTransactions.filter((t) => {
  //     return (
  //       passedMonths.includes(t.date.month) &&
  //       t.date.month !== currentMonthString
  //     )
  //   })

  //   const totalCategorySpent = getTransactionsTotalByCategory({
  //     transactions: priorMonthsTransactions,
  //     category: confirmEdit.category,
  //   })

  //   const divisor = isFirstMonth ? 12 : passedMonths.length - 1
  //   if (divisor <= 0) {
  //     return "0.00"
  //   }

  //   const averagedSpent = totalCategorySpent / divisor
  //   const roundedBudget = Math.round(averagedSpent / 5) * 5

  //   return roundedBudget.toFixed(2)
  // }, [confirmEdit, passedMonths, transactions, today.year, currentMonthString])

  return (
    <Stack direction={"column"} spacing={1.5} sx={{ paddingBottom: "50px" }}>
      <MonthYearSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resetSelectedDate={resetSelectedDate}
        showMonth={true}
      />

      <BudgetTransactions
        transactions={monthExpenseTransactions}
        refreshTransactions={loadTransactions}
        budgetCategories={categories}
        // setSelectedTransaction={setSelectedTransaction}
        setAlertToast={setAlertToast}
        // setOpenDialog={setOpenEditDialog}
        // isLoading={isLoading}
        // setBudgetEditDialogOpen={setBudgetEditDialogOpen}
        // setConfirmEdit={setConfirmEdit}
        inputRef={inputRef}
        selectedDate={selectedDate}
      />

      {/* <AddEditDialog
        openDialog={openEditDialog}
        setOpenDialog={setOpenEditDialog}
        setAlertToast={setAlertToast}
        incomeCategories={incomeCategories}
        expenseCategories={expenseCategories}
        inputRef={inputRef}
        refreshTransactions={refreshTransactions}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        transactions={transactions}
        type={type}
        setType={setType}
      /> */}

      {/* <AddBudgetDialog
        openBudgetDialog={openBudgetDialog}
        setOpenBudgetDialog={setOpenBudgetDialog}
        confirmSelection={confirmSelection}
        setConfirmSelection={setConfirmSelection}
        budgetCategories={budgetCategories}
        loadCategories={loadCategories}
        expenseCategories={expenseCategories}
        setAlertToast={setAlertToast}
      /> */}

      {/* <EditBudgetDialog
        budgetEditDialogOpen={budgetEditDialogOpen}
        setBudgetEditDialogOpen={setBudgetEditDialogOpen}
        confirmEdit={confirmEdit}
        setAlertToast={setAlertToast}
        inputRef={inputRef}
        recommendedBudget={recommendedCategoryBudget}
      /> */}

      <AlertToast alertToast={alertToast} />

      {/* <AddDataButton
        action={() => {
          setOpenBudgetDialog(true)
        }}
      /> */}
    </Stack>
  )
}

export default Budget
