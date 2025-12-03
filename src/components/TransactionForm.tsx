"use client"

import { 
  Box, 
  Button,
  FormControl,
  InputAdornment, 
  InputLabel, 
  MenuItem, 
  OutlinedInput, 
  Select, 
  SelectChangeEvent, 
  Stack } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import { ChangeEvent, useEffect, useState } from "react"
import saveTransaction from "@/utils/saveTransaction";
import { accentColorPrimary } from "@/globals/colors";

const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

const years = [
  "2023",
  "2024",
  "2025"
]

export type TransactionType = {
  month: string,
  year: string,
  category: string,
  amount: string
}

const TransactionForm = (props: {
  categories: string[],
  type: string,
  refreshTransactions: () => void
}) => {
  const { categories, type, refreshTransactions } = props

  const TRANSACTION_INIT: TransactionType = {
    month: months[currentMonth],
    year: String(currentYear),
    category: categories[0],
    amount: "0000.00"
  }

  const [transaction, setTransaction] = useState<TransactionType>(TRANSACTION_INIT)

  useEffect(() => {
    setTransaction(prev => ({
      ...prev,
      type: type,
    }));
  }, [])

  const handleYear = (e: SelectChangeEvent) => {
    const { value } = e.target

    setTransaction(prev => ({
      ...prev,
      year: value,
    }));
  }

  const handleMonth = (e: SelectChangeEvent) => {
    const { value } = e.target

    setTransaction(prev => ({
      ...prev,
      month: value,
    }));
  }

  const handleCategory = (e: SelectChangeEvent) => {
    const { value } = e.target

    setTransaction(prev => ({
      ...prev,
      category: value,
    }));
  }

  const handleAmount = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let digits = e.target.value.replace(/\D/g, ""); // numbers only

    // If user cleared everything
    if (digits === "") digits = "000000"; // force 0000.00

    // Guarantee at least 6 digits so we always have xx.xx
    digits = digits.padStart(6, "0");

    // Last 2 = cents
    const cents = digits.slice(-2);

    // Everything before cents
    let dollars = digits.slice(0, -2);

    // Remove *unnecessary* leading zeros in dollars
    dollars = dollars.replace(/^0+/, "");

    // But ensure AT LEAST 4 dollars digits
    dollars = dollars.padStart(4, "0");

    const formatted = `${dollars}.${cents}`;

    if (formatted.length <= 7) {
      setTransaction(prev => ({
        ...prev,
        amount: formatted,
      }));
    }
  }

  const save = () => {
    saveTransaction({key: type, transaction: transaction})
    refreshTransactions()
  }

  return (
    <Box
      width={"fit-content"}
      padding={"10px"}
    >
      <Stack
        direction={"row"}
        gap={2}
      >
        <FormControl>
          <InputLabel>Year</InputLabel>
          <Select
            label="Year"
            value={transaction.year}
            name={"year"}
            onChange={e => handleYear(e)}
            sx={{
              width: "150px"
            }}
          >
            {years.map((year) => {
              return <MenuItem value={year}>{year}</MenuItem>
            })}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Month</InputLabel>
          <Select
            label="Month"
            value={transaction.month}
            name={"month"}
            onChange={e => handleMonth(e)}
            sx={{
              width: "150px"
            }}
          >
            {months.map((month) => {
              return <MenuItem value={month}>{month}</MenuItem>
            })}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={transaction.category}
            name={"category"}
            onChange={e => handleCategory(e)}
            sx={{
              width: "150px"
            }}
          >
            {categories.map((category) => {
              return <MenuItem value={category}>{category}</MenuItem>
            })}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Amount</InputLabel>
          <OutlinedInput
            label={"Amount"}
            value={transaction.amount}
            name={"amount"}
            onChange={e => handleAmount(e)}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            sx={{
              width: "150px"
            }}
            />
        </FormControl>

        <Button 
          variant={"contained"} 
          disabled={
            transaction.amount === "0000.00"
          }
          onClick={save}
        >
          <AddIcon/>
        </Button>
      </Stack>
    </Box>
  )
}

export default TransactionForm