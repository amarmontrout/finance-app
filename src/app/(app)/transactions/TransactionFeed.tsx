"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material"
import { useUser } from "@/hooks/useUser"
import {
  AlertToastType,
  HookSetter,
  SelectedTransactionType,
} from "@/utils/type"
import { useMemo, useState } from "react"
import TransactionList from "./TransactionList"

const TransactionFeed = ({
  selectedMonth,
  selectedYear,
  currentTheme,
  selectedTransaction,
  setSelectedTransaction,
  openEditDialog,
  setOpenEditDialog,
  setAlertToast,
}: {
  selectedMonth: string
  selectedYear: number
  currentTheme: string | undefined
  selectedTransaction: SelectedTransactionType | null
  setSelectedTransaction: HookSetter<SelectedTransactionType | null>
  openEditDialog: boolean
  setOpenEditDialog: HookSetter<boolean>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const {
    incomeTransactionsV2,
    expenseTransactionsV2,
    refreshIncomeTransactionsV2,
    refreshExpenseTransactionsV2,
    isLoading,
  } = useTransactionContext()
  const user = useUser()

  const [type, setType] = useState<"income" | "expense">("income")

  const handleSelectType = (
    event: React.MouseEvent<HTMLElement>,
    newType: "income" | "expense" | null,
  ) => {
    if (newType !== null) {
      setType(newType)
    }
  }

  const filteredIncome = useMemo(() => {
    return incomeTransactionsV2.filter(
      (t) => t.year === selectedYear && t.month === selectedMonth,
    )
  }, [incomeTransactionsV2, selectedYear, selectedMonth])

  const filteredExpense = useMemo(() => {
    return expenseTransactionsV2.filter(
      (t) => t.year === selectedYear && t.month === selectedMonth,
    )
  }, [expenseTransactionsV2, selectedYear, selectedMonth])

  return (
    <ShowCaseCard title={""}>
      <Stack className="xl:w-[50%]" spacing={2} margin={"0 auto"}>
        <ToggleButtonGroup
          value={type}
          exclusive
          size={"small"}
          onChange={handleSelectType}
          sx={{
            width: "100%",
            justifyContent: "center",
            gap: 3,
            "& .MuiToggleButton-root": {
              borderRadius: "15px",
              border: "1px solid",
              px: 3,
              textTransform: "none",
            },
            "& .MuiToggleButtonGroup-grouped": {
              margin: 0,
              border: "1px solid",
              "&:not(:first-of-type)": {
                borderLeft: "1px solid",
              },
            },
          }}
        >
          <ToggleButton value={"income"} color={"success"}>
            Income
          </ToggleButton>

          <ToggleButton value={"expense"} color={"error"}>
            Expense
          </ToggleButton>
        </ToggleButtonGroup>

        {type === "income" && (
          <TransactionList
            title={"Income"}
            transactions={filteredIncome}
            type={"income"}
            user={user}
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
            openEditDialog={openEditDialog}
            setOpenEditDialog={setOpenEditDialog}
            refreshIncomeTransactionsV2={refreshIncomeTransactionsV2}
            refreshExpenseTransactionsV2={refreshExpenseTransactionsV2}
            currentTheme={currentTheme}
            isLoading={isLoading}
            setAlertToast={setAlertToast}
          />
        )}

        {type === "expense" && (
          <TransactionList
            title={"Expense"}
            transactions={filteredExpense}
            type={"expense"}
            user={user}
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
            openEditDialog={openEditDialog}
            setOpenEditDialog={setOpenEditDialog}
            refreshIncomeTransactionsV2={refreshIncomeTransactionsV2}
            refreshExpenseTransactionsV2={refreshExpenseTransactionsV2}
            currentTheme={currentTheme}
            isLoading={isLoading}
            setAlertToast={setAlertToast}
          />
        )}
      </Stack>
    </ShowCaseCard>
  )
}

export default TransactionFeed
