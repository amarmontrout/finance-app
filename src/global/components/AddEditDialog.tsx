import {
  TransactionTypeValue,
  V2CreateTransactionType,
  V2TransactionType,
} from "@/api/v2/models"
import { saveTransactionV2, updateTransactionV2 } from "@/api/v2/requests"
import AddTransaction, {
  ActiveFieldType,
} from "@/app/(admin)/v2/forms/AddTransaction"
import { useTransactionContext } from "@/app/(admin)/v2/TransactionsContext"
import { getToday } from "@/app/(admin)/v2/utils"
import { CloseIcon } from "@/assets/icons"
import { AlertToastType, HookSetter } from "@/types/types"

import AddReturn from "@/app/(admin)/v2/forms/AddReturn"
import { useDataContext } from "@/contexts/data-context"
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
import { isoToString } from "../formattingFunctions"

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

const AddEditDialog = ({
  openDialog,
  setOpenDialog,
  setAlertToast,
  inputRef,
  selectedTransaction,
  setSelectedTransaction,
}: {
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
  setAlertToast: HookSetter<AlertToastType | undefined>
  inputRef: RefObject<HTMLInputElement | null>
  selectedTransaction?: V2TransactionType | null
  setSelectedTransaction?: HookSetter<V2TransactionType | null>
}) => {
  const { refreshTransactions, transactionsWithReturns } =
    useTransactionContext()
  const { merchantMap, categoryMap } = useDataContext()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [transaction, setTransaction] = useState<V2CreateTransactionType>(
    createInitialTransaction(),
  )
  const [returnTransaction, setReturnTransaction] =
    useState<V2CreateTransactionType>(createInitialTransaction())
  const [creatingReturn, setCreatingReturn] = useState<boolean>(false)
  const [activeReturnField, setActiveReturnField] =
    useState<ActiveFieldType>(null)

  const isEditing = !!selectedTransaction
  const containsReturn =
    selectedTransaction != null &&
    transactionsWithReturns.has(selectedTransaction.transaction_id)

  const save = async () => {
    setIsLoading(true)
    try {
      if (isEditing && selectedTransaction && creatingReturn) {
        await saveTransactionV2({
          body: {
            ...returnTransaction,
            parent_transaction_id: selectedTransaction.transaction_id,
          },
        })
        await updateTransactionV2({
          rowId: selectedTransaction.transaction_id,
          body: {
            ...selectedTransaction,
            amount: selectedTransaction.amount - returnTransaction.amount,
          },
        })
      } else if (isEditing && selectedTransaction && !creatingReturn) {
        const updatedTransaction: V2TransactionType = {
          ...selectedTransaction,
          ...transaction,
        }
        await updateTransactionV2({
          rowId: selectedTransaction.transaction_id,
          body: updatedTransaction,
        })
      } else {
        await saveTransactionV2({
          body: transaction,
        })
      }

      await refreshTransactions()

      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "success",
        message: creatingReturn
          ? "Return saved successfully!"
          : isEditing
            ? "Transaction updated successfully!"
            : "Transaction saved successfully!",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: creatingReturn
          ? "Return could not be saved!"
          : isEditing
            ? "Transaction could not be updated!"
            : "Transaction could not be saved!",
      })
    } finally {
      setTransaction(createInitialTransaction())
      setSelectedTransaction?.(null)
      setOpenDialog(false)
      setIsLoading(false)
      setCreatingReturn(false)
      setReturnTransaction(createInitialTransaction())
      setActiveReturnField(null)
    }
  }

  // Resets state when dialog is closed
  const closeDialog = () => {
    if (creatingReturn) {
      setCreatingReturn(false)
      setReturnTransaction(createInitialTransaction())
      setActiveReturnField(null)
      return
    } else {
      setOpenDialog(false)
      setTransaction(createInitialTransaction())
      setSelectedTransaction?.(null)
    }
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

  // Set up return transaction when an expense is selected
  useEffect(() => {
    if (
      selectedTransaction &&
      selectedTransaction.transaction_type === "Expense"
    ) {
      setReturnTransaction({
        transaction_type: "Return",
        amount: 0,
        transaction_date: getToday(),
        category_id: selectedTransaction.category_id,
        merchant_id: selectedTransaction.merchant_id,
        account_id: selectedTransaction.account_id,
        description: "",
        is_paid: null,
      })
    }
  }, [selectedTransaction])

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
          {!creatingReturn && (
            <Typography>{`${isEditing ? "EDIT" : "NEW"} TRANSACTION`}</Typography>
          )}
          {creatingReturn && <Typography>RETURN</Typography>}

          <IconButton
            loading={isLoading}
            onClick={save}
            disabled={
              creatingReturn
                ? returnTransaction.amount === 0
                : transaction.amount === 0 ||
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
        {!creatingReturn && (
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
              setCreatingReturn={setCreatingReturn}
            />

            {containsReturn && <Typography>Contains a return</Typography>}
          </Stack>
        )}

        {creatingReturn && (
          <Stack width={"100%"} textAlign={"center"}>
            <Typography>
              {`${isoToString(selectedTransaction?.transaction_date!)}: 
              ${merchantMap.get(selectedTransaction?.merchant_id!)?.name} - 
              ${categoryMap.get(selectedTransaction?.category_id!)?.name}`}
            </Typography>

            <AddReturn
              returnTransaction={returnTransaction}
              setReturnTransaction={setReturnTransaction}
              activeReturnField={activeReturnField}
              setActiveReturnField={setActiveReturnField}
              creatingReturn={creatingReturn}
              inputRef={inputRef}
            />
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AddEditDialog
