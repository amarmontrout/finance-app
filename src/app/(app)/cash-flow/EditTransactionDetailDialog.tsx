import {
  Dialog,
  DialogTitle,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  DialogContent,
  FormControlLabel,
  Checkbox,
  Stack,
  IconButton,
  Typography,
} from "@mui/material"
import { ChangeEvent, RefObject, useEffect, useState } from "react"
import { MoneyInputV2 } from "../../../components/MoneyInput"
import {
  AlertToastType,
  ChoiceTypeV2,
  HookSetter,
  SelectedTransactionType,
  TransactionTypeV2,
} from "@/utils/type"
import { updateExpense, updateIncome } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import CloseIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"

const EditTransactionDetailDialog = ({
  openEditDialog,
  setOpenEditDialog,
  selectedTransaction,
  setSelectedTransaction,
  transactions,
  categories,
  selectedYear,
  selectedMonth,
  refreshIncomeTransactions,
  refreshExpenseTransactions,
  setAlertToast,
  inputRef,
}: {
  openEditDialog: boolean
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
  selectedTransaction: SelectedTransactionType | null
  setSelectedTransaction: HookSetter<SelectedTransactionType | null>
  transactions: TransactionTypeV2[]
  categories: ChoiceTypeV2[]
  selectedYear: number
  selectedMonth: string
  refreshIncomeTransactions: () => void
  refreshExpenseTransactions: () => void
  setAlertToast: HookSetter<AlertToastType | undefined>
  inputRef: RefObject<HTMLInputElement | null>
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
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
      isPaid: transaction.isPaid,
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
    setIsLoading(true)
    try {
      if (selectedTransaction.type === "income") {
        await updateIncome({
          userId: user.id,
          rowId: selectedTransaction.id,
          body: updateTransaction,
        })
        refreshIncomeTransactions()
      } else if (selectedTransaction.type === "expense") {
        await updateExpense({
          userId: user.id,
          rowId: selectedTransaction.id,
          body: updateTransaction,
        })
        refreshExpenseTransactions()
      }
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "success",
        message: "Transaction updated successfully!",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "error",
        message: "Transaction could not be updated.",
      })
    } finally {
      setOpenEditDialog(false)
      setSelectedTransaction(null)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={openEditDialog} fullScreen>
      <DialogTitle>
        <Stack
          width={"100%"}
          height={"100%"}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <IconButton
            onClick={() => {
              setOpenEditDialog(false)
              setSelectedTransaction(null)
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography>
            {`Edit ${selectedTransaction?.type === "income" ? "Income" : "Expense"} Detail`}
          </Typography>

          <IconButton
            loading={isLoading}
            disabled={
              !updateTransaction.category || updateTransaction.amount <= 0
            }
            onClick={handleUpdateTransactionData}
          >
            <SaveIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Box className="flex flex-col gap-5" padding={"10px"}>
          {openEditDialog && (
            <MoneyInputV2
              value={updateTransaction.amount}
              setValue={setUpdateTransaction}
              inputRef={inputRef}
              autoFocus={openEditDialog}
            />
          )}

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

          {selectedTransaction?.type === "expense" && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={updateTransaction.isPaid}
                  sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setUpdateTransaction((prev) => ({
                      ...prev,
                      isPaid: e.target.checked,
                    }))
                  }}
                />
              }
              label="Is paid?"
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default EditTransactionDetailDialog
