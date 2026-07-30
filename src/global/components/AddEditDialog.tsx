import { ChoiceType } from "@/api/choices/models"
import { TransactionType } from "@/api/transactions/models"
import { saveTransaction, updateTransaction } from "@/api/transactions/requests"
import TransactionTypeToggle from "@/app/(admin)/transactions/_components/TransactionTypeToggle"
import { CloseIcon } from "@/assets/icons"
import { useUser } from "@/hooks/use-user"
import { AlertToastType, HookSetter } from "@/types/types"
import SaveIcon from "@mui/icons-material/Save"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material"
import { RefObject, useEffect, useMemo, useState } from "react"
import { getCurrentDateInfo, makeId } from "../infoFunctions"
import NewTransactionForm from "./NewTransactionForm"

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
  type,
  setType,
}: {
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
  setAlertToast: HookSetter<AlertToastType | undefined>
  incomeCategories: ChoiceType[]
  expenseCategories: ChoiceType[]
  inputRef: RefObject<HTMLInputElement | null>
  refreshTransactions: () => Promise<void>
  selectedTransaction?: TransactionType | null
  setSelectedTransaction?: HookSetter<TransactionType | null>
  transactions: TransactionType[]
  type: "income" | "expense"
  setType: HookSetter<"income" | "expense">
}) => {
  const user = useUser()
  const { today } = getCurrentDateInfo()

  const createInitialTransaction = (): TransactionType => ({
    id: makeId(),
    date: today,
    amount: 0,
    category: "",
    note: "",
    payment_method: "",
    type: "income",
    is_paid: false,
    is_return: false,
    is_deleted: false,
    deleted_at: null,
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [transaction, setTransaction] = useState<TransactionType>(
    createInitialTransaction(),
  )

  const isEditing = !!selectedTransaction

  const allNotes = useMemo(() => {
    return [
      ...new Set(
        transactions
          .filter((e) => e.type === type && e.note)
          .map((e) => e.note),
      ),
    ]
  }, [transactions, type])

  const resetFormData = () => {
    setTransaction(createInitialTransaction())
  }

  const save = async () => {
    if (!user || !transaction) return
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
      setType(selectedTransaction.type)
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
      payment_method: type === "income" ? "" : "Credit",
      type: type,
      is_paid: type === "expense" ? true : false,
      is_return: false,
    }))
  }, [type, openDialog, selectedTransaction])

  return (
    <Dialog open={openDialog} fullScreen>
      <DialogTitle>
        <Stack
          direction={"row"}
          sx={{
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Typography>
            {`${isEditing ? "EDIT" : "NEW"} ${type.toUpperCase()} TRANSACTION`}
          </Typography>
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
        <Stack direction={"column"} spacing={3}>
          {!isEditing && (
            <TransactionTypeToggle type={type} setType={setType} />
          )}

          <NewTransactionForm
            transaction={transaction}
            setTransaction={setTransaction}
            allNotes={allNotes}
            categories={
              type === "expense" ? expenseCategories : incomeCategories
            }
            openDialog={openDialog}
            inputRef={inputRef}
            currentYear={today.year}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditDialog
