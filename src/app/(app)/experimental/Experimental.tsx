"use client"

import AddDataButton from "@/components/AddDataButton"
import { Stack } from "@mui/material"
import { useRef, useState } from "react"
import AddDialog from "./AddDialog"
import { AlertToastType } from "@/utils/type"
import AlertToast from "@/components/AlertToast"
import { useCategoryContext } from "@/contexts/categories-context"
import { useTransactionContext } from "@/contexts/transactions-context"

const Experimental = () => {
  const { transactions, refreshTransactions } = useTransactionContext()
  const { incomeCategoriesV2, expenseCategoriesV2 } = useCategoryContext()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [alertToast, setAlertToast] = useState<AlertToastType>()

  return (
    <Stack spacing={1.5}>
      <AddDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setAlertToast={setAlertToast}
        incomeCategoriesV2={incomeCategoriesV2}
        expenseCategoriesV2={expenseCategoriesV2}
        inputRef={inputRef}
        transactions={transactions}
        refreshTransactions={refreshTransactions}
      />

      <AlertToast alertToast={alertToast} />

      <AddDataButton
        action={() => {
          setOpenDialog(true)
          setTimeout(() => {
            inputRef.current?.focus()
          }, 50)
        }}
      />
    </Stack>
  )
}

export default Experimental
