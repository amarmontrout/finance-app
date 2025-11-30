"use client"

import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import { ChangeEvent, useState } from "react"

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
  month: string,
  category: string,
  amount: string
}

const TransactionForm = (props: {
  categories: string[]
}) => {
  const { categories } = props

  const TRANSACTION_INIT: TransactionType = {
    month: months[currentMonth],
    category: categories[0],
    amount: "00.00"
  }

  const [transaction, setTransaction] = useState<TransactionType>(TRANSACTION_INIT)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target

    setTransaction(prev => ({
      ...prev,
      [name]: value,
    }));
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
            onChange={handleChange}
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
            onChange={e => handleChange(e)}
            sx={{
              width: "200px"
            }}
          >
            {categories.map((category) => {
              return <MenuItem value={category}>{category}</MenuItem>
            })}
          </Select>
        </FormControl>

        <TextField
          label={"Amount"}
          value={transaction.amount}
          name={"amount"}
          onChange={e => handleChange(e)}
        />

        <IconButton>
          <AddIcon/>
        </IconButton>
      </Stack>
    </Box>
  )
}

export default TransactionForm