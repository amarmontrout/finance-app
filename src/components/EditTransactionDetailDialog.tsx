import { useTransactionContext } from "@/contexts/transactions-context"
import { lightMode, darkMode } from "@/globals/colors"
import { EXPENSES, INCOME } from "@/globals/globals"
import { getCurrentDateInfo } from "@/utils/helperFunctions"
import saveTransaction, { TransactionData } from "@/utils/saveTransaction"
import { 
  Dialog, 
  DialogTitle, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  OutlinedInput, 
  InputAdornment, 
  Stack, 
  Button, 
  SelectChangeEvent
} from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"

type UpdateTransactionType = {
  id: string
  category: string,
  amount: string
}

const EditTransactionDetailDialog = (props: {
  openEditDialog: boolean
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
  type: string
  selectedId: string,
  transactions: TransactionData
  categories: string[]
  currentTheme: string | undefined
  selectedYear: string
  selectedMonth: string
}) => {

  const {
    openEditDialog,
    setOpenEditDialog,
    type,
    selectedId,
    transactions,
    categories,
    currentTheme,
    selectedYear,
    selectedMonth
  } = props

  const UPDATE_TRANSACTION_INIT: UpdateTransactionType = {
    id: "",
    category: categories[0],
    amount: ""
  }

  const {
    refreshIncomeTransactions,
    refreshExpenseTransactions,
  } =useTransactionContext()
 
  const [updateTransaction, setUpdateTransaction] = useState<UpdateTransactionType>(UPDATE_TRANSACTION_INIT)

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
    
  const handleAmount = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    const cents = digits.slice(-2);
    let dollars = digits.slice(0, -2);
    dollars = dollars.replace(/^0+/, "");
    const formatted = `${dollars}.${cents}`;

    if (formatted.length <= 7) {
      setUpdateTransaction(prev => ({
        ...prev,
        amount: dollars || cents ? formatted : "",
      }));
    }
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
      refreshIncomeTransactions()
    } else if (type === EXPENSES) {
      refreshExpenseTransactions()
    }
  }

  return (
    <Dialog open={openEditDialog}>
      <DialogTitle>{`Edit ${type === INCOME ? "Income" : "Expense"} Detail`}</DialogTitle>

      <Box
        className="flex flex-col gap-5"
        width={"fit-content"}
        padding={"10px"}
        margin={"0 auto"}
      >
        <FormControl>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={updateTransaction.category}
            name={"category"}
            onChange={e => handleCategory(e)}
            sx={{
              width: "100%"
            }}
          >
            {categories.map((category) => {
              return <MenuItem value={category}>{category}</MenuItem>
            })}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Amount</InputLabel>
          <OutlinedInput
            label={"Amount"}
            value={updateTransaction.amount}
            name={"amount"}
            onChange={e => handleAmount(e)}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            sx={{
              width: "100%"
            }}
            />
        </FormControl>

        <Stack direction={"row"} gap={1} justifyContent={"right"}>
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
              setUpdateTransaction(UPDATE_TRANSACTION_INIT)
            }}
            sx={{
              backgroundColor: currentTheme === "light" 
                ? [lightMode.error] 
                : [darkMode.error]
            }}
          >
            {"Cancel"}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  )
}

export default EditTransactionDetailDialog