"use client"

import { 
  Box, 
  Button,
  FormControl,
  InputLabel, 
  MenuItem,  
  Select, 
  SelectChangeEvent 
} from "@mui/material"
import { useEffect, useState } from "react"
import { MONTHS } from "@/globals/globals";
import { accentColorSecondary } from "@/globals/colors";
import { saveTransaction } from "@/utils/transactionStorage";
import { Choice } from "@/contexts/categories-context";
import MoneyInput from "./MoneyInput";

const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

export type TransactionType = {
  month: string,
  year: string,
  category: string,
  amount: string
}

const TransactionForm = ({ 
  categories, 
  type, 
  refreshTransactions,
  years 
}: {
  categories: Choice[],
  type: string,
  refreshTransactions: () => void
  years: Choice[]
}) => {
  const TRANSACTION_INIT: TransactionType = {
    month: MONTHS[currentMonth],
    year: String(currentYear),
    category: categories[0].name,
    amount: ""
  }

  const [transaction, setTransaction] = 
    useState<TransactionType>(TRANSACTION_INIT)

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
      className="flex flex-col xl:flex-row gap-5 sm:w-fit"
      paddingTop={"10px"}
      margin={"0 auto"}
    >
      <Box
        className="flex flex-col sm:flex-row gap-5"
      >
        <FormControl>
          <InputLabel>Year</InputLabel>
          <Select
            className="w-full sm:w-[175px]"
            label="Year"
            value={transaction.year}
            name={"year"}
            onChange={e => handleYear(e)}
          >
            {years.map((year) => {
              return (
              <MenuItem 
                value={year.name}
              >
                {year.name}
              </MenuItem>
            )
            })}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Month</InputLabel>
          <Select
            className="w-full sm:w-[175px]"
            label="Month"
            value={transaction.month}
            name={"month"}
            onChange={e => handleMonth(e)}
          >
            {MONTHS.map((month) => {
              return <MenuItem value={month}>{month}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Box>
          
      <Box
        className="flex flex-col sm:flex-row gap-5"
      >
        <FormControl>
          <InputLabel>Category</InputLabel>
          <Select
            className="w-full sm:w-[175px]"
            label="Category"
            value={transaction.category}
            name={"category"}
            onChange={e => handleCategory(e)}
          >
            {categories.map((category) => {
              return (
                <MenuItem 
                  value={category.name}
                >
                  {category.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <MoneyInput
          value={transaction.amount}
          setValue={setTransaction}
          smallWidthBp={"sm"}
        />
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