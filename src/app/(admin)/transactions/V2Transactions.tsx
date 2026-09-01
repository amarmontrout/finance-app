"use client"

import AddDataButton from "@/global/components/AddDataButton"
import AddEditDialog from "@/global/components/AddEditDialog"
import AlertToast from "@/global/components/AlertToast"
import MonthYearSelector from "@/global/components/MonthYearSelector"
import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useRef, useState } from "react"
import AppCard from "../v2/components/AppCard"
import { useTransactionContext } from "../v2/TransactionsContext"
import TransactionTypeToggle from "./_components/TransactionTypeToggle"
import TransactionCardHeader from "./TransactionCardHeader"
import TransactionDisplay from "./TransactionDisplay"

const V2Transactions = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const {
    selectedTransaction,
    setSelectedTransaction,
    alertToast,
    setAlertToast,
    isLoading,
    typeFilteredTransactions,
  } = useTransactionContext()

  const [openDialog, setOpenDialog] = useState<boolean>(false)

  return (
    <Stack spacing={1} paddingBottom={"56px"}>
      <MonthYearSelector showMonth={true} showYearButtons={false} />

      <TransactionTypeToggle />

      <AppCard>
        {isLoading ? (
          <Box textAlign={"center"}>
            <CircularProgress sx={{ color: "#3E5942" }} />
          </Box>
        ) : (
          <Stack spacing={1}>
            <TransactionCardHeader />

            {typeFilteredTransactions.length === 0 ? (
              <Typography sx={{ width: "100%", textAlign: "center" }}>
                There are no transactions
              </Typography>
            ) : (
              <TransactionDisplay setOpenDialog={setOpenDialog} />
            )}
          </Stack>
        )}
      </AppCard>

      <AddEditDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setAlertToast={setAlertToast}
        inputRef={inputRef}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
      />

      <AddDataButton
        action={() => {
          setOpenDialog(true)
          setTimeout(() => {
            inputRef.current?.focus()
          }, 50)
        }}
      />

      <AlertToast alertToast={alertToast} />
    </Stack>
  )
}

export default V2Transactions
