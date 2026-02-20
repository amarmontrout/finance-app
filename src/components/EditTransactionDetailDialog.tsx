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
  DialogContent
} from "@mui/material"
import { useEffect, useState } from "react"
import { MoneyInputV2 } from "./MoneyInput"
import { ChoiceTypeV2, TransactionTypeV2 } from "@/utils/type"
import { updateExpense, updateIncome } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"

const EditTransactionDetailDialog = ({
    openEditDialog,
    setOpenEditDialog,
    type,
    selectedId,
    transactions,
    categories,
    currentTheme,
    selectedYear,
    selectedMonth,
    refreshIncomeTransactions,
    refreshExpenseTransactions
  }: {
  openEditDialog: boolean
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
  type: string
  selectedId: number | null,
  transactions: TransactionTypeV2[]
  categories: ChoiceTypeV2[]
  currentTheme: string | undefined
  selectedYear: string
  selectedMonth: string
  refreshIncomeTransactions?: () => void
  refreshExpenseTransactions?: () => void
}) => { 
  const UPDATE_TRANSACTION_INIT = {
    id: 0,
    month: selectedMonth,
    year: Number(selectedYear),
    category: "",
    amount: 0
  }

  const user = useUser()

  const [updateTransaction, setUpdateTransaction] = 
    useState<TransactionTypeV2>(UPDATE_TRANSACTION_INIT)

  useEffect(() => {
    if (!selectedId || !selectedYear || !selectedMonth) return

    const transaction = transactions.find(t => t.id === selectedId)

    if (!transaction) return

    setUpdateTransaction({
      id: transaction.id,
      month: selectedMonth,
      year: Number(selectedYear),
      category: transaction.category,
      amount: transaction.amount,
    })
  }, [selectedId, transactions])

  const handleCategory = (e: SelectChangeEvent) => {
    const { value } = e.target

    setUpdateTransaction(prev => ({
      ...prev,
      category: value,
    }));
  }

  const handleUpdateTransactionData = async () => {
    if (!selectedYear || !selectedMonth || !selectedId || !user) return
    if (type === "income") {
      await updateIncome({
        userId: user.id,
        rowId: selectedId,
        body: updateTransaction

      })
      if (refreshIncomeTransactions) 
        refreshIncomeTransactions()
    } else if (type === "expenses") {
      await updateExpense({
        userId: user.id,
        rowId: selectedId,
        body: updateTransaction

      })
      if (refreshExpenseTransactions)
        refreshExpenseTransactions()
    }
    setOpenEditDialog(false)
  }

  return (
    <Dialog open={openEditDialog}>
      <DialogTitle>
        {`Edit ${type === "income" ? "Income" : "Expense"} Detail`}
      </DialogTitle>
      
      <DialogContent>
        <Box
          className="flex flex-col gap-5"
          padding={"10px"}
        >
          <FormControl>
            <InputLabel>Category</InputLabel>
            <Select
              className="w-full sm:w-[175px]"
              label="Category"
              value={updateTransaction.category}
              name={"category"}
              onChange={e => handleCategory(e)}
            >
              {categories.map((category) => {
                return (
                <MenuItem 
                  value={category.name}
                >
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
            false
          }
          onClick={handleUpdateTransactionData}
          sx={{
            backgroundColor: currentTheme === "light" 
              ? [lightMode.success] 
              : [darkMode.success]
          }}
        >
          {"Update"}
        </Button>
        
        <Button 
          variant={"contained"} 
          disabled={
            false
          }
          onClick={() => {
            setOpenEditDialog(false)
          }}
          sx={{
            backgroundColor: currentTheme === "light" 
              ? [lightMode.error] 
              : [darkMode.error]
          }}
        >
          {"Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditTransactionDetailDialog