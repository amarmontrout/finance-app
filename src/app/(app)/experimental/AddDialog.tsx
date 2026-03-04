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
import CloseIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"
import {
  AlertToastType,
  ChoiceTypeV2,
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

const AddDialog = ({
  openDialog,
  setOpenDialog,
  setAlertToast,
  incomeCategoriesV2,
  expenseCategoriesV2,
  inputRef,
  allNotes,
  refreshTransactions,
  selectedTransaction,
  setSelectedTransaction,
}: {
  openDialog: boolean
  setOpenDialog: HookSetter<boolean>
  setAlertToast: HookSetter<AlertToastType | undefined>
  incomeCategoriesV2: ChoiceTypeV2[]
  expenseCategoriesV2: ChoiceTypeV2[]
  inputRef: RefObject<HTMLInputElement | null>
  allNotes: string[]
  refreshTransactions: () => Promise<void>
  selectedTransaction?: NewTransactionType | null
  setSelectedTransaction?: HookSetter<NewTransactionType | null>
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

  const isEdit = Boolean(selectedTransaction)

  const [type, setType] = useState<"income" | "expense">(
    selectedTransaction?.type ?? "income",
  )
  const [transaction, setTransaction] = useState<NewTransactionType>(
    selectedTransaction ?? createInitialTransaction(),
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSelectType = (
    event: React.MouseEvent<HTMLElement>,
    newType: "income" | "expense" | null,
  ) => {
    if (newType !== null) {
      setType(newType)
    }
  }

  useEffect(() => {
    if (openDialog) {
      if (selectedTransaction) {
        setTransaction(selectedTransaction)
        setType(selectedTransaction.type)
      } else {
        resetFormData()
      }
    }
  }, [openDialog, selectedTransaction])

  useEffect(() => {
    setTransaction((prev) => ({
      ...prev,
      category: "",
      note: "",
      payment_method: type === "income" ? "" : "Debit",
      type: type,
      is_paid: false,
      is_return: false,
    }))
  }, [type])

  const resetFormData = () => {
    setType("income")
    setTransaction(createInitialTransaction())
  }

  const save = async () => {
    if (!user || !transaction) return
    setIsLoading(true)
    try {
      if (isEdit && setSelectedTransaction) {
        await updateTransaction({
          userId: user.id,
          rowId: transaction.id,
          body: transaction,
        })
        setAlertToast({
          open: true,
          onClose: () => {
            setAlertToast(undefined)
          },
          severity: "success",
          message: "Transaction updated successfully!",
        })
        setSelectedTransaction(null)
      } else {
        await saveTransaction({
          userId: user.id,
          body: transaction,
        })
        setAlertToast({
          open: true,
          onClose: () => {
            setAlertToast(undefined)
          },
          severity: "success",
          message: "Transaction saved successfully!",
        })
      }
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "error",
        message: "Transaction could not be saved.",
      })
    } finally {
      refreshTransactions()
      resetFormData()
      setOpenDialog(false)
      setIsLoading(false)
    }
  }

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
          <IconButton
            onClick={() => {
              setOpenDialog(false)
              resetFormData()
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography>
            {isEdit ? "Edit Transaction" : "New Transaction"}
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
        <Stack gap={2}>
          <ToggleButtonGroup
            value={type}
            exclusive
            size={"small"}
            onChange={handleSelectType}
            disabled={isEdit}
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
            key={type}
            transaction={transaction}
            setTransaction={setTransaction}
            allNotes={allNotes}
            categories={
              type === "expense" ? expenseCategoriesV2 : incomeCategoriesV2
            }
            today={TODAY}
            openDialog={openDialog}
            inputRef={inputRef}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default AddDialog
