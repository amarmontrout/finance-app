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
import CloseIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"
import {
  AlertToastType,
  ChoiceTypeV2,
  HookSetter,
  TransactionTypeV2,
} from "@/utils/type"
import { RefObject, useState } from "react"
import TransactionForm from "@/components/TransactionForm"
import { getCurrentDateInfo, makeId } from "@/utils/helperFunctions"
import { saveExpense, saveIncome } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"

const AddTransactionDialog = ({
  openAddTransactionDialog,
  setOpenAddTransactionDialog,
  incomeCategoriesV2,
  refreshIncomeTransactionsV2,
  expenseCategoriesV2,
  refreshExpenseTransactionsV2,
  yearsV2,
  setAlertToast,
  inputRef,
}: {
  openAddTransactionDialog: boolean
  setOpenAddTransactionDialog: HookSetter<boolean>
  incomeCategoriesV2: ChoiceTypeV2[]
  refreshIncomeTransactionsV2: () => void
  expenseCategoriesV2: ChoiceTypeV2[]
  refreshExpenseTransactionsV2: () => void
  yearsV2: ChoiceTypeV2[]
  setAlertToast: HookSetter<AlertToastType | undefined>
  inputRef: RefObject<HTMLInputElement | null>
}) => {
  const { currentYear, currentMonth } = getCurrentDateInfo()
  const user = useUser()

  const TRANSACTION_INIT: TransactionTypeV2 = {
    id: Number(makeId(8)),
    month: currentMonth,
    year: currentYear,
    category: "",
    amount: 0,
  }

  const [type, setType] = useState<"income" | "expense">("expense")
  const [transaction, setTransaction] =
    useState<TransactionTypeV2>(TRANSACTION_INIT)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSelectType = (
    event: React.MouseEvent<HTMLElement>,
    newType: "income" | "expense" | null,
  ) => {
    if (newType !== null) {
      setType(newType)
    }
  }

  const resetFormData = () => {
    setType("expense")
    setTransaction(TRANSACTION_INIT)
  }

  const save = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      if (type === "income") {
        await saveIncome({ userId: user.id, body: transaction })
        refreshIncomeTransactionsV2()
      } else {
        await saveExpense({ userId: user.id, body: transaction })
        refreshExpenseTransactionsV2()
      }
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "success",
        message: "Transaction saved successfully!",
      })
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
      resetFormData()
      setOpenAddTransactionDialog(false)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={openAddTransactionDialog} fullScreen>
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
              setOpenAddTransactionDialog(false)
              resetFormData()
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography>{"New Transaction"}</Typography>
          <IconButton
            loading={isLoading}
            disabled={transaction.amount === 0}
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

          <TransactionForm
            key={type}
            transaction={transaction}
            setTransaction={setTransaction}
            categories={
              type === "expense" ? expenseCategoriesV2 : incomeCategoriesV2
            }
            years={yearsV2}
            currentMonth={currentMonth}
            currentYear={currentYear}
            openAddTransactionDialog={openAddTransactionDialog}
            inputRef={inputRef}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default AddTransactionDialog
