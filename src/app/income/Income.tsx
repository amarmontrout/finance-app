"use client"

import LineChart from "@/components/LineChart"
import ShowCaseCard from "@/components/ShowCaseCard"
import TransactionsList from "@/components/TransactionsList"
import { lightMode, darkMode } from "@/globals/colors"
import { INCOME, INCOME_CATEGORIES } from "@/globals/globals"
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

export type UpdateTransactionType = {
  id: string
  category: string,
  amount: string
}

const Income = () => {
  const [incomeTransactions, setIncomeTransactions] = useState<TransactionData>({})
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [totalIncome, setTotalIncome] = useState<string>("")

  const UPDATE_TRANSACTION_INIT: UpdateTransactionType = {
    id: "",
    category: INCOME_CATEGORIES[0],
    amount: ""
  }

  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>("")
  const [updateTransaction, setUpdateTransaction] = useState<UpdateTransactionType>(UPDATE_TRANSACTION_INIT)
    
  const theme = useTheme()
  const currentTheme = theme.theme
    
  const refreshTransactions = () => {
    const localIncomeData = getTransactions({key: INCOME})
    if (!localIncomeData) {
      return
    }
    setIncomeTransactions(localIncomeData)
  }
    
  useEffect(() => {
    refreshTransactions()
  }, [])
    
  useEffect(() => {
    if (selectedMonth !== "" && incomeTransactions) {
      const total = getMonthTotal( selectedYear, selectedMonth, incomeTransactions)
      if (!total) return
      setTotalIncome(total)
    }
    if (selectedMonth == "") {
      setTotalIncome("$ 0")
    }
  }, [selectedMonth, incomeTransactions])

  useEffect(() => {
    if (!selectedId || !selectedYear || !selectedMonth) return

    const transaction =
      incomeTransactions?.[selectedYear]?.[selectedMonth]?.find(
        (detail) => detail.id === selectedId
      )

    if (!transaction) return

    setUpdateTransaction({
      id: transaction.id,
      category: transaction.category,
      amount: transaction.amount,
    })
  }, [selectedId, selectedYear, selectedMonth, incomeTransactions])


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

    const updatedIncomeTransactions: TransactionData = {
      ...incomeTransactions,
      [selectedYear]: {
        ...incomeTransactions[selectedYear],
        [selectedMonth]: incomeTransactions[selectedYear][selectedMonth].map(
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

    saveTransaction({key: INCOME, updatedTransactionData: updatedIncomeTransactions})
    setOpenEditDialog(false)
    refreshTransactions()
  }

  return (
    <Box
      className="flex flex-col xl:flex-row gap-2 h-full"
    >
      <ShowCaseCard title={"Income"} secondaryTitle={`Total ${totalIncome}`}>
        <TransactionsList
          type={INCOME}
          transactions={incomeTransactions}
          refreshTransactions={refreshTransactions}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          setOpenEditDialog={setOpenEditDialog}
          setSelectedId={setSelectedId}
        />
      </ShowCaseCard>
      
      <ShowCaseCard title={"Income Chart"} secondaryTitle={""}>
        <LineChart
          selectedYear={selectedYear}
          transactions={incomeTransactions}
          type={"Income"}
          lineColors={
            currentTheme === "light" 
            ? [lightMode.success] 
            : [darkMode.success]
          }
        />
      </ShowCaseCard>

      <Dialog open={openEditDialog}>
        <DialogTitle>Edit Income Transaction</DialogTitle>
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
              {INCOME_CATEGORIES.map((category) => {
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

export default Income