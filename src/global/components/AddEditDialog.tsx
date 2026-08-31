import {
  TransactionTypeValue,
  V2CreateTransactionType,
  V2TransactionType,
} from "@/api/v2/models"
import { saveTransactionV2, updateTransactionV2 } from "@/api/v2/requests"
import AddTransaction from "@/app/(admin)/v2/forms/AddTransaction"
import { getToday } from "@/app/(admin)/v2/utils"
import { CloseIcon } from "@/assets/icons"
import { AlertToastType, HookSetter } from "@/types/types"

import SaveIcon from "@mui/icons-material/Save"
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
import { RefObject, useEffect, useState } from "react"

const transactionToForm = (
  transaction: V2TransactionType,
): V2CreateTransactionType => ({
  amount: transaction.amount,
  transaction_date: transaction.transaction_date,
  category_id: transaction.category_id,
  merchant_id: transaction.merchant_id,
  account_id: transaction.account_id,
  transaction_type: transaction.transaction_type,
  description: transaction.description ?? "",
  is_paid: transaction.is_paid,
})

const createInitialTransaction = (): V2CreateTransactionType => ({
  transaction_type: "Income",
  amount: 0,
  transaction_date: getToday(),
  category_id: null,
  merchant_id: null,
  account_id: null,
  description: "",
  is_paid: null,
})

// TODO: Then when calculating total expense, subtract the return amount from
// the transaction_id that equals the parent_transaction_id so that the amount
// display is reduced by the return amount. Mabye note that this transaction
// contains a return. Do the same with the total expense calculation. We also
// want to not count unpaid transactions in the total amount.

const AddEditDialog = ({
  openDialog,
  setOpenDialog,
  setAlertToast,
  inputRef,
  refreshTransactions,
  selectedTransaction,
  setSelectedTransaction,
  transactionsWithReturns,
}: {
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
  setAlertToast: HookSetter<AlertToastType | undefined>
  inputRef: RefObject<HTMLInputElement | null>
  refreshTransactions: () => Promise<void>
  selectedTransaction?: V2TransactionType | null
  setSelectedTransaction?: HookSetter<V2TransactionType | null>
  transactionsWithReturns: Map<string, string[]>
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [transaction, setTransaction] = useState<V2CreateTransactionType>(
    createInitialTransaction(),
  )

  const isEditing = !!selectedTransaction
  const containsReturn = transactionsWithReturns.has(
    selectedTransaction?.transaction_id!,
  )

  const updateTransaction = async () => {
    if (!selectedTransaction) return
    const updatedTransaction: V2TransactionType = {
      ...selectedTransaction,
      ...transaction,
    }
    await updateTransactionV2({
      rowId: selectedTransaction.transaction_id,
      body: updatedTransaction,
    })
  }

  const saveNewTransaction = async () => {
    await saveTransactionV2({
      body: transaction,
    })
  }

  const save = async () => {
    setIsLoading(true)
    try {
      if (isEditing) {
        updateTransaction()
      } else {
        saveNewTransaction()
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
      setTransaction(createInitialTransaction())
      setSelectedTransaction?.(null)
      setOpenDialog(false)
      setIsLoading(false)
    }
  }

  // Resets state when dialog is closed
  const closeDialog = () => {
    setOpenDialog(false)
    setTransaction(createInitialTransaction())
    setSelectedTransaction?.(null)
  }

  // Toggles transaction type for new transaction
  const handleSelectType = (
    event: React.MouseEvent<HTMLElement>,
    newType: TransactionTypeValue,
  ) => {
    if (newType !== null) {
      setTransaction((prev) => ({
        ...prev,
        transaction_type: newType,
      }))
    }
  }

  // Populates form with default values or selected transaction values
  useEffect(() => {
    if (!openDialog) return
    if (selectedTransaction) {
      setTransaction(transactionToForm(selectedTransaction))
    } else {
      setTransaction(createInitialTransaction())
    }
  }, [openDialog, selectedTransaction])

  // Toggles focus on amount input
  useEffect(() => {
    if (!inputRef.current) return
    if (transaction.amount === 0) {
      inputRef.current.focus()
    }
  }, [openDialog])

  return (
    <Dialog open={openDialog} fullScreen>
      <DialogTitle sx={{ backgroundColor: "#3E5942" }}>
        <Stack
          direction={"row"}
          sx={{
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton onClick={closeDialog}>
            <CloseIcon />
          </IconButton>

          <Typography>{`${isEditing ? "EDIT" : "NEW"} TRANSACTION`}</Typography>

          <IconButton
            loading={isLoading}
            onClick={save}
            disabled={
              transaction.amount === 0 ||
              transaction.account_id === null ||
              transaction.category_id === null ||
              transaction.merchant_id === null
            }
          >
            <SaveIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: "#3E5942" }}>
        <Stack width={"100%"} textAlign={"center"} spacing={3}>
          {!isEditing && (
            <ToggleButtonGroup
              value={transaction.transaction_type}
              exclusive
              onChange={handleSelectType}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "& .MuiToggleButton-root": {
                  border: "none",
                  textTransform: "none",
                  fontWeight: 400,
                  backgroundColor: "transparent",
                  "&.Mui-selected": {
                    backgroundColor: "transparent",
                    color: "white",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "transparent",
                  },
                },
                "& .MuiToggleButton-root:not(:last-of-type)": {
                  borderRight: "1px solid",
                  borderColor: "#102A1B",
                },
              }}
            >
              <ToggleButton
                className="text-dark-4 dark:text-dark-6"
                value={"Income"}
                disableRipple
                sx={{
                  "&.Mui-selected": {
                    color: "#102A1B",
                  },
                }}
              >
                Income
              </ToggleButton>

              <ToggleButton
                className="text-dark-4 dark:text-dark-6"
                value={"Expense"}
                disableRipple
                sx={{
                  "&.Mui-selected": {
                    color: "#102A1B",
                  },
                }}
              >
                Expense
              </ToggleButton>
            </ToggleButtonGroup>
          )}

          <AddTransaction
            inputRef={inputRef}
            transaction={transaction}
            setTransaction={setTransaction}
            openDialog={openDialog}
            isEditing={isEditing}
          />

          {containsReturn && <Typography>Contains a return</Typography>}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditDialog
