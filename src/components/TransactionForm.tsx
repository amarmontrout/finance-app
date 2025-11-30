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

const today = new Date()
const currentMonth = today.getMonth()

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

type TransactionType = {
  type: string | undefined,
  month: string,
  category: string,
  amount: string
}

const TransactionForm = (props: {
  categories: string[],
  type: string
}) => {
  const { categories, type } = props

  const TRANSACTION_INIT: TransactionType = {
    type: undefined,
    month: months[currentMonth],
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
          <InputLabel>Month</InputLabel>
          <Select
            label="Month"
            value={transaction.month}
            name={"month"}
            onChange={e => handleMonth(e)}
            sx={{
              width: "200px"
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
              width: "200px"
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
            />
        </FormControl>

        <Button 
          variant={"contained"} 
          disabled={
            transaction.type === undefined
            || transaction.amount === "0000.00"
          }
        >
          <AddIcon/>
        </Button>
      </Stack>
    </Box>
  )
}

export default TransactionForm