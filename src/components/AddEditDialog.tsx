import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import { RefObject, useEffect, useMemo, useState } from "react"
import CloseIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"
import {
  AlertToastType,
  ChoiceType,
  DateType,
  HookSetter,
  NewTransactionType,
} from "@/utils/type"
import { useUser } from "@/hooks/useUser"
import {
  saveTransaction,
  updateTransaction,
} from "@/app/api/Transactions/requests"
import NewTransactionForm from "./NewTransactionForm"
import { getCurrentDateInfo, makeId } from "@/utils/helperFunctions"

const AddEditDialog = ({
  openDialog,
  setOpenDialog,
  setAlertToast,
  incomeCategories,
  expenseCategories,
  inputRef,
  refreshTransactions,
  selectedTransaction,
  setSelectedTransaction,
  transactions,
}: {
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
  setAlertToast: HookSetter<AlertToastType | undefined>
  incomeCategories: ChoiceType[]
  expenseCategories: ChoiceType[]
  inputRef: RefObject<HTMLInputElement | null>
  refreshTransactions: () => Promise<void>
  selectedTransaction?: NewTransactionType | null
  setSelectedTransaction?: HookSetter<NewTransactionType | null>
  transactions: NewTransactionType[]
}) => {
  const user = useUser()
  const { currentYear, currentDay, currentMonth } = getCurrentDateInfo()

  const TODAY: DateType = {
    month: currentMonth,
    day: currentDay,
    year: currentYear,
  }

  const createInitialTransaction = (): NewTransactionType => ({
    id: makeId(),
    date: TODAY,
    amount: 0,
    category: "",
    note: "",
    payment_method: "",
    type: "income",
    is_paid: false,
    is_return: false,
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [dialogType, setDialogType] = useState<"income" | "expense">("income")
  const [transaction, setTransaction] = useState<NewTransactionType>(
    createInitialTransaction(),
  )

  const allNotes = useMemo(() => {
    return [
      ...new Set(
        transactions
          .filter((e) => e.type === dialogType && e.note)
          .map((e) => e.note),
      ),
    ]
  }, [transactions, dialogType])

  const handleSelectType = (
    event: React.MouseEvent<HTMLElement>,
    newType: "income" | "expense" | null,
  ) => {
    if (newType !== null) {
      setDialogType(newType)
    }
  }

  const resetFormData = () => {
    setDialogType("income")
    setTransaction(createInitialTransaction())
  }

  const save = async () => {
    if (!user || !transaction) return

    const isEditing = !!selectedTransaction

    setIsLoading(true)

    try {
      if (isEditing) {
        await updateTransaction({
          userId: user.id,
          rowId: selectedTransaction.id,
          body: transaction,
        })
      } else {
        await saveTransaction({
          userId: user.id,
          body: transaction,
        })
      }

      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "success",
        message: isEditing
          ? "Transaction updated successfully!"
          : "Transaction saved successfully!",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: isEditing
          ? "Transaction could not be updated."
          : "Transaction could not be saved.",
      })
    } finally {
      await refreshTransactions()
      resetFormData()
      setSelectedTransaction?.(null)
      setOpenDialog(false)
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setOpenDialog(false)
    resetFormData()
    setSelectedTransaction?.(null)
  }

  useEffect(() => {
    if (!openDialog) return

    if (selectedTransaction) {
      setDialogType(selectedTransaction.type)
      setTransaction(selectedTransaction)
    } else {
      resetFormData()
    }
  }, [openDialog, selectedTransaction])

  useEffect(() => {
    if (!openDialog) return
    if (selectedTransaction) return

    setTransaction((prev) => ({
      ...prev,
      category: "",
      note: "",
      payment_method: dialogType === "income" ? "" : "Debit",
      type: dialogType,
      is_paid: false,
      is_return: false,
    }))
  }, [dialogType, openDialog, selectedTransaction])

  return (
    <Dialog open={openDialog} fullScreen>
      <DialogTitle>
        <Stack
          width={"100%"}
          height={"100%"}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Typography>{"New Transaction"}</Typography>
          <IconButton
            loading={isLoading}
            disabled={transaction?.amount === 0}
            onClick={save}
          >
            <SaveIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack gap={2}>
          <ToggleButtonGroup
            value={dialogType}
            exclusive
            size={"small"}
            onChange={handleSelectType}
            disabled={selectedTransaction !== null}
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
            <ToggleButton value="income" color="success">
              Income
            </ToggleButton>

            <ToggleButton value="expense" color="error">
              Expense
            </ToggleButton>
          </ToggleButtonGroup>

          <NewTransactionForm
            key={dialogType}
            transaction={transaction}
            setTransaction={setTransaction}
            allNotes={allNotes}
            categories={
              dialogType === "expense" ? expenseCategories : incomeCategories
            }
            openDialog={openDialog}
            inputRef={inputRef}
            currentYear={currentYear}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditDialog
