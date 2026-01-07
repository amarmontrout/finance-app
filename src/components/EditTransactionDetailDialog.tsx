import { Choice } from "@/contexts/categories-context"
import { lightMode, darkMode } from "@/globals/colors"
import { EXPENSES, INCOME } from "@/globals/globals"
import { saveTransaction, TransactionData } from "@/utils/transactionStorage"
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
import MoneyInput from "./MoneyInput"

type UpdateTransactionType = {
  id: string
  category: string,
  amount: string
}

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
  selectedId: string,
  transactions: TransactionData
  categories: Choice[]
  currentTheme: string | undefined
  selectedYear: string
  selectedMonth: string
  refreshIncomeTransactions?: () => void
  refreshExpenseTransactions?: () => void
}) => {
  const UPDATE_TRANSACTION_INIT: UpdateTransactionType = {
    id: "",
    category: categories[0].name,
    amount: ""
  }
 
  const [updateTransaction, setUpdateTransaction] = 
    useState<UpdateTransactionType>(UPDATE_TRANSACTION_INIT)

  useEffect(() => {
    if (!selectedId || !selectedYear || !selectedMonth) return

    const transaction =
      transactions?.[selectedYear]?.[selectedMonth]?.find(
        (detail) => detail.id === selectedId
      )

    if (!transaction) return

    setUpdateTransaction({
      id: transaction.id,
      category: transaction.category,
      amount: transaction.amount,
    })
  }, [selectedId, selectedYear, selectedMonth, transactions])

  const handleCategory = (e: SelectChangeEvent) => {
    const { value } = e.target

    setUpdateTransaction(prev => ({
      ...prev,
      category: value,
    }));
  }

  const handleUpdateTransactionData = () => {
    if (!selectedYear || !selectedMonth || !selectedId) return

    const updatedTransactions: TransactionData = {
      ...transactions,
      [selectedYear]: {
        ...transactions[selectedYear],
        [selectedMonth]: transactions[selectedYear][selectedMonth].map(
          (detail) =>
            detail.id === selectedId
              ? {
                  ...detail,
                  category: updateTransaction.category,
                  amount: updateTransaction.amount,
                }
              : detail
        ),
      },
    }

    saveTransaction({key: type, updatedTransactionData: updatedTransactions})
    setOpenEditDialog(false)

    if (type === INCOME) {
      if (refreshIncomeTransactions) 
        refreshIncomeTransactions()
    } else if (type === EXPENSES) {
      if (refreshExpenseTransactions)
        refreshExpenseTransactions()
    }
  }

  return (
    <Dialog open={openEditDialog}>
      <DialogTitle>
        {`Edit ${type === INCOME ? "Income" : "Expense"} Detail`}
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

          <MoneyInput
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