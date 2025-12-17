"use client"

import LineChart from "@/components/LineChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { lightMode, darkMode } from "@/globals/colors"
import { EXPENSE_CATEGORIES, EXPENSES } from "@/globals/globals"
import { getMonthTotal } from "@/utils/getTotals"
import getTransactions from "@/utils/getTransactions"
import saveTransaction, { TransactionData } from "@/utils/saveTransaction"
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  FormControl, 
  InputAdornment, 
  InputLabel, 
  MenuItem, 
  OutlinedInput, 
  Select, 
  SelectChangeEvent, 
  Stack 
} from "@mui/material"
import { useTheme } from "next-themes"
import { useState, useEffect, ChangeEvent } from "react"
import { UpdateTransactionType } from "../income/Income"

const Expenses = () => {
  const [expenseTransactions, setExpenseTransactions] = useState<TransactionData>({})
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [totalExpenses, setTotalExpenses] = useState<string>("")

  const UPDATE_TRANSACTION_INIT: UpdateTransactionType = {
    id: "",
    category: EXPENSE_CATEGORIES[0],
    amount: ""
  }

  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>("")
  const [updateTransaction, setUpdateTransaction] = useState<UpdateTransactionType>(UPDATE_TRANSACTION_INIT)

  const theme = useTheme()
  const currentTheme = theme.theme

  const refreshTransactions = () => {
    const localExpenseData = getTransactions({key: EXPENSES})
    if (!localExpenseData) {
      return
    }
    setExpenseTransactions(localExpenseData)
  }

  useEffect(() => {
    refreshTransactions()
  }, [])

  useEffect(() => {
    if (selectedMonth !== "" && expenseTransactions) {
      const total = getMonthTotal(selectedYear, selectedMonth, expenseTransactions)
      if (!total) return
      setTotalExpenses(total)
    }
    if (selectedMonth == "") {
      setTotalExpenses("$ 0")
    }
  }, [selectedMonth, expenseTransactions])

    useEffect(() => {
    if (!selectedId || !selectedYear || !selectedMonth) return

    const transaction =
      expenseTransactions?.[selectedYear]?.[selectedMonth]?.find(
        (detail) => detail.id === selectedId
      )

    if (!transaction) return

    setUpdateTransaction({
      id: transaction.id,
      category: transaction.category,
      amount: transaction.amount,
    })
  }, [selectedId, selectedYear, selectedMonth, expenseTransactions])


  const handleCategory = (e: SelectChangeEvent) => {
    const { value } = e.target

    setUpdateTransaction(prev => ({
      ...prev,
      category: value,
    }));
  }
  
  const handleAmount = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    const cents = digits.slice(-2);
    let dollars = digits.slice(0, -2);
    dollars = dollars.replace(/^0+/, "");
    const formatted = `${dollars}.${cents}`;

    if (formatted.length <= 7) {
      setUpdateTransaction(prev => ({
        ...prev,
        amount: dollars || cents ? formatted : "",
      }));
    }
  }

  const handleUpdateTransactionData = () => {
    if (!selectedYear || !selectedMonth || !selectedId) return

    const updatedExpenseTransactions: TransactionData = {
      ...expenseTransactions,
      [selectedYear]: {
        ...expenseTransactions[selectedYear],
        [selectedMonth]: expenseTransactions[selectedYear][selectedMonth].map(
          (detail) =>
            detail.id === selectedId
              ? {
                  ...detail,
                  category: updateTransaction.category,
                  amount: updateTransaction.amount,
                }
              : detail
        ),
      },
    }

    saveTransaction({key: EXPENSES, updatedTransactionData: updatedExpenseTransactions})
    setOpenEditDialog(false)
    refreshTransactions()
  }

  return (
    <Box
      className="flex flex-col xl:flex-row gap-2 h-full"
    >
      <ShowCaseCard title={"Expenses"} secondaryTitle={`Total ${totalExpenses}`}>
        <TransactionsList
          type={EXPENSES}
          transactions={expenseTransactions}
          refreshTransactions={refreshTransactions}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          setOpenEditDialog={setOpenEditDialog}
          setSelectedId={setSelectedId}
        />
      </ShowCaseCard>
      
      <ShowCaseCard title={"Expenses Chart"} secondaryTitle={""}>
        <LineChart
          selectedYear={selectedYear}
          transactions={expenseTransactions}
          type={"Expenses"}
          lineColors={
            currentTheme === "light" 
            ? [lightMode.error] 
            : [darkMode.error]
          }
          height="400px"
        />
      </ShowCaseCard>

      <Dialog open={openEditDialog}>
        <DialogTitle>Edit Expense Transaction</DialogTitle>
        <Box
          className="flex flex-col gap-5"
          width={"fit-content"}
          padding={"10px"}
          margin={"0 auto"}
        >
          <FormControl>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={updateTransaction.category}
              name={"category"}
              onChange={e => handleCategory(e)}
              sx={{
                width: "100%"
              }}
            >
              {EXPENSE_CATEGORIES.map((category) => {
                return <MenuItem value={category}>{category}</MenuItem>
              })}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel>Amount</InputLabel>
            <OutlinedInput
              label={"Amount"}
              value={updateTransaction.amount}
              name={"amount"}
              onChange={e => handleAmount(e)}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              sx={{
                width: "100%"
              }}
              />
          </FormControl>

          <Stack direction={"row"} gap={1}>
            <Button 
              variant={"contained"} 
              disabled={
                false
              }
              onClick={handleUpdateTransactionData}
              sx={{
                backgroundColor: currentTheme === "light" 
                  ? [lightMode.success] 
                  : [darkMode.success]
              }}
            >
              {"Update"}
            </Button>
            
            <Button 
              variant={"contained"} 
              disabled={
                false
              }
              onClick={() => {
                setOpenEditDialog(false)
                setUpdateTransaction(UPDATE_TRANSACTION_INIT)
              }}
              sx={{
                backgroundColor: currentTheme === "light" 
                  ? [lightMode.error] 
                  : [darkMode.error]
              }}
            >
              {"Cancel"}
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  )
}

export default Expenses