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
import { ChangeEvent, useEffect, useState } from "react"
import saveTransaction from "@/utils/saveTransaction";
import { MONTHS, YEARS } from "@/globals/globals";

const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

export type TransactionType = {
  month: string,
  year: string,
  category: string,
  amount: string
}

const TransactionForm = (props: {
  categories: string[],
  type: string,
}) => {
  const { categories, type } = props

  const TRANSACTION_INIT: TransactionType = {
    month: MONTHS[currentMonth],
    year: String(currentYear),
    category: categories[0],
    amount: ""
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
    let digits = e.target.value.replace(/\D/g, "");
    const cents = digits.slice(-2);
    let dollars = digits.slice(0, -2);
    dollars = dollars.replace(/^0+/, "");
    const formatted = `${dollars}.${cents}`;

    if (formatted.length <= 7) {
      setTransaction(prev => ({
        ...prev,
        amount: dollars || cents ? formatted : "",
      }));
    }
  }

  const resetFormData = () => {
    setTransaction(TRANSACTION_INIT)
  }

  const save = () => {
    saveTransaction({key: type, transaction: transaction})
    resetFormData()
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
              width: "175px"
            }}
          >
            {YEARS.map((year) => {
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
              width: "175px"
            }}
          >
            {MONTHS.map((month) => {
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
              width: "175px"
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
              width: "175px"
            }}
            />
        </FormControl>

        <Button 
          variant={"contained"} 
          disabled={
            transaction.amount === ""
          }
          onClick={save}
        >
          {/* <AddIcon/> */}
          Add
        </Button>
      </Stack>
    </Box>
  )
}

export default TransactionForm