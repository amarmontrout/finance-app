import { CreateTransactionType } from "@/app/(api)/transactions/models"
import { createTransaction } from "@/app/(api)/transactions/requests"
import { useTransactionContext } from "@/app/contexts/transaction-context"
import { TEXT_COLOR } from "@/app/data/colors"
import { formatDate } from "@/app/lib/functions/formatters"
import { HookSetter } from "@/app/lib/types"
import { Button, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import DateInput from "../inputs/DateInput"
import DescriptionInput from "../inputs/DescriptionInput"
import MoneyInput from "../inputs/MoneyInput"
import { AlertToastType } from "../ui/AlertToast"
import FormRow from "../ui/FormRow"
import { ActiveFieldType } from "./TransactionForm"

const ReturnForm = ({
  refreshTransactions,
  setAlertToast,
}: {
  refreshTransactions: () => Promise<void>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const {
    createInitialTransaction,
    selectedTransaction,
    openAddReturn,
    setOpenAddReturn,
  } = useTransactionContext()

  const [returnTransaction, setReturnTransaction] =
    useState<CreateTransactionType>(createInitialTransaction())
  const [activeField, setActiveField] = useState<ActiveFieldType>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createTransaction({ body: returnTransaction })
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "success",
        message: "Return saved successfully!",
      })
      setReturnTransaction(createInitialTransaction())
      await refreshTransactions()
      setOpenAddReturn(false)
    } catch (error) {
      console.log(error)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: "Failed to save return!",
      })
    }
  }

  const updateTransaction = <K extends keyof CreateTransactionType>(
    key: K,
    value: CreateTransactionType[K],
  ) => {
    setReturnTransaction({ ...returnTransaction, [key]: value })
  }

  // Set up return transaction when an expense is selected
  useEffect(() => {
    if (
      !selectedTransaction ||
      selectedTransaction.transaction_type !== "Expense"
    ) {
      return
    }

    setReturnTransaction({
      transaction_type: "Return",
      amount: 0,
      transaction_date: returnTransaction.transaction_date,
      category_id: selectedTransaction.category_id,
      merchant_id: selectedTransaction.merchant_id,
      account_id: selectedTransaction.account_id,
      parent_transaction_id: selectedTransaction.transaction_id,
      description: "",
      is_paid: null,
    })
  }, [selectedTransaction])

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction={"column"} spacing={2}>
        <MoneyInput
          value={returnTransaction.amount}
          onChange={(value) => updateTransaction("amount", value)}
          autoFocus={openAddReturn}
        />

        <Stack
          direction={"column"}
          spacing={0.5}
          divider={<hr />}
          sx={{ width: "100%" }}
        >
          {/* DATE */}
          <FormRow
            active={activeField === "date"}
            label={"Date"}
            display={
              <Typography>
                {formatDate(returnTransaction.transaction_date)}
              </Typography>
            }
            edit={
              <DateInput
                value={returnTransaction.transaction_date}
                onChange={(value) =>
                  updateTransaction("transaction_date", value)
                }
                autoFocus={activeField === "date"}
                onBlur={() => setActiveField(null)}
              />
            }
            onClick={
              activeField !== "date" ? () => setActiveField("date") : undefined
            }
          />

          {/* DESCRIPTION */}
          <FormRow
            active={activeField === "description"}
            label={"Description"}
            display={
              <Typography>
                {returnTransaction.description !== ""
                  ? returnTransaction.description
                  : "Add a Description"}
              </Typography>
            }
            edit={
              <DescriptionInput
                value={returnTransaction.description ?? ""}
                onChange={(value) => updateTransaction("description", value)}
                autoFocus={activeField === "description"}
                onBlur={() => setActiveField(null)}
              />
            }
            onClick={
              activeField !== "description"
                ? () => setActiveField("description")
                : undefined
            }
          />
        </Stack>

        <Button
          type={"submit"}
          sx={{ color: TEXT_COLOR }}
          disabled={returnTransaction.amount === 0}
        >
          Add Return
        </Button>
      </Stack>
    </form>
  )
}

export default ReturnForm
