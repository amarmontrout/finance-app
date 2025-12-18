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
  SelectChangeEvent 
} from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"
import saveTransaction from "@/utils/saveTransaction";
import { MONTHS, YEARS } from "@/globals/globals";
import { accentColorSecondary } from "@/globals/colors";
import { useTransactionContext } from "@/contexts/transactions-context";

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
  refreshTransactions: () => void
}) => {
  const { categories, type, refreshTransactions } = props

  const { isMockData } = useTransactionContext()

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
    refreshTransactions()
    resetFormData()
  }

  return (
    <Box
      className="flex flex-col xl:flex-row gap-5"
      width={"fit-content"}
      paddingTop={"20px"}
      margin={"0 auto"}
    >
      <Box
        className="flex flex-row gap-5"
      >
        <FormControl>
          <InputLabel>Year</InputLabel>
          <Select
            label="Year"
            value={transaction.year}
            name={"year"}
            onChange={e => handleYear(e)}
            sx={{
              width: "175px",
              minWidth: "fit-content"
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
              width: "175px",
              minWidth: "fit-content"
            }}
          >
            {MONTHS.map((month) => {
              return <MenuItem value={month}>{month}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Box>
          
      <Box
        className="flex flex-row gap-5"
      >
        <FormControl>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={transaction.category}
            name={"category"}
            onChange={e => handleCategory(e)}
            sx={{
              width: "175px",
              minWidth: "fit-content"
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
              width: "175px",
              minWidth: "fit-content"
            }}
            />
        </FormControl>        
      </Box>

      <Button 
        variant={"contained"} 
        disabled={
          transaction.amount === ""
        }
        onClick={save}
        sx={{
          backgroundColor: accentColorSecondary
        }}
      >
        {`Add ${type}`}
      </Button>
    </Box>
  )
}

export default TransactionForm