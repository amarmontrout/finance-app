import { lightMode, darkMode } from "@/globals/colors"
import {
  Dialog,
  DialogTitle,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  DialogActions,
  DialogContent,
} from "@mui/material"
import { useEffect, useState } from "react"
import { MoneyInputV2 } from "./MoneyInput"
import {
  ChoiceTypeV2,
  HookSetter,
  SelectedTransactionType,
  TransactionTypeV2,
} from "@/utils/type"
import { updateExpense, updateIncome } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"

const EditTransactionDetailDialog = ({
  openEditDialog,
  setOpenEditDialog,
  selectedTransaction,
  setSelectedTransaction,
  transactions,
  categories,
  currentTheme,
  selectedYear,
  selectedMonth,
  refreshIncomeTransactions,
  refreshExpenseTransactions,
}: {
  openEditDialog: boolean
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
  selectedTransaction: SelectedTransactionType | null
  setSelectedTransaction: HookSetter<SelectedTransactionType | null>
  transactions: TransactionTypeV2[]
  categories: ChoiceTypeV2[]
  currentTheme: string | undefined
  selectedYear: number
  selectedMonth: string
  refreshIncomeTransactions?: () => void
  refreshExpenseTransactions?: () => void
}) => {
  const UPDATE_TRANSACTION_INIT = {
    id: 0,
    month: selectedMonth,
    year: selectedYear,
    category: "",
    amount: 0,
  }

  const user = useUser()

  const [updateTransaction, setUpdateTransaction] = useState<TransactionTypeV2>(
    UPDATE_TRANSACTION_INIT,
  )

  useEffect(() => {
    if (!selectedTransaction || !selectedYear || !selectedMonth) return

    const transaction = transactions.find(
      (t) => t.id === selectedTransaction.id,
    )

    if (!transaction) return

    setUpdateTransaction({
      id: transaction.id,
      month: transaction.month,
      year: transaction.year,
      category: transaction.category,
      amount: transaction.amount,
    })
  }, [selectedTransaction, transactions, selectedYear, selectedMonth])

  const handleCategory = (e: SelectChangeEvent) => {
    const { value } = e.target

    setUpdateTransaction((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handleUpdateTransactionData = async () => {
    if (!selectedYear || !selectedMonth || !selectedTransaction || !user) return
    if (selectedTransaction.type === "income") {
      await updateIncome({
        userId: user.id,
        rowId: selectedTransaction.id,
        body: updateTransaction,
      })
      if (refreshIncomeTransactions) refreshIncomeTransactions()
    } else if (selectedTransaction.type === "expense") {
      await updateExpense({
        userId: user.id,
        rowId: selectedTransaction.id,
        body: updateTransaction,
      })
      if (refreshExpenseTransactions) refreshExpenseTransactions()
    }
    setOpenEditDialog(false)
    setSelectedTransaction(null)
  }

  return (
    <Dialog open={openEditDialog}>
      <DialogTitle>
        {`Edit ${selectedTransaction?.type === "income" ? "Income" : "Expense"} Detail`}
      </DialogTitle>

      <DialogContent>
        <Box className="flex flex-col gap-5" padding={"10px"}>
          <FormControl>
            <InputLabel>Category</InputLabel>
            <Select
              className="w-full sm:w-[175px]"
              label="Category"
              value={updateTransaction.category}
              name={"category"}
              onChange={(e) => handleCategory(e)}
            >
              {categories.map((category) => {
                return (
                  <MenuItem key={category.name} value={category.name}>
                    {category.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <MoneyInputV2
            value={updateTransaction.amount}
            setValue={setUpdateTransaction}
            smallWidthBp={"sm"}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant={"contained"}
          disabled={
            !updateTransaction.category || updateTransaction.amount <= 0
          }
          onClick={handleUpdateTransactionData}
          sx={{
            backgroundColor:
              currentTheme === "light"
                ? [lightMode.success]
                : [darkMode.success],
          }}
        >
          {"Update"}
        </Button>

        <Button
          variant={"contained"}
          disabled={false}
          onClick={() => {
            setOpenEditDialog(false)
            setSelectedTransaction(null)
          }}
          sx={{
            backgroundColor:
              currentTheme === "light" ? [lightMode.error] : [darkMode.error],
          }}
        >
          {"Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditTransactionDetailDialog
