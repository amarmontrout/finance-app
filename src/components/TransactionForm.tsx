"use client"

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material"
import { useEffect, useState } from "react"
import { MONTHS } from "@/globals/globals"
import { accentColorSecondary } from "@/globals/colors"
import { MoneyInputV2 } from "./MoneyInput"
import { ChoiceTypeV2, TransactionTypeV2 } from "@/utils/type"
import { saveExpenses, saveIncome } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import { makeId } from "@/utils/helperFunctions"

const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

export type TransactionType = {
  month: string
  year: string
  category: string
  amount: string
}

const TransactionForm = ({
  categories,
  type,
  refreshTransactions,
  years,
}: {
  categories: ChoiceTypeV2[]
  type: "income" | "expenses"
  refreshTransactions: () => void
  years: ChoiceTypeV2[]
}) => {
  const TRANSACTION_INIT: TransactionTypeV2 = {
    id: Number(makeId(8)),
    month: MONTHS[currentMonth],
    year: currentYear,
    category: "",
    amount: 0,
  }

  const user = useUser()

  const [transaction, setTransaction] =
    useState<TransactionTypeV2>(TRANSACTION_INIT)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!categories.length) return

    setTransaction({
      id: Number(makeId(8)),
      month: MONTHS[currentMonth],
      year: currentYear,
      category: categories[0].name,
      amount: 0,
    })
  }, [categories])

  const handleYear = (e: SelectChangeEvent<string>) => {
    const value = Number(e.target.value)
    setTransaction((prev) => ({
      ...prev,
      year: value,
    }))
  }

  const handleMonth = (e: SelectChangeEvent) => {
    const { value } = e.target
    setTransaction((prev) => ({
      ...prev,
      month: value,
    }))
  }

  const handleCategory = (e: SelectChangeEvent) => {
    const { value } = e.target
    setTransaction((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const resetFormData = () => {
    setTransaction(TRANSACTION_INIT)
  }

  const save = async () => {
    if (!user) return

    setIsLoading(true)

    if (type === "income") {
      await saveIncome({
        userId: user?.id,
        body: transaction,
      })
      setIsLoading(false)
    } else if (type === "expenses") {
      await saveExpenses({
        userId: user.id,
        body: transaction,
      })
      setIsLoading(false)
    }

    refreshTransactions()
    resetFormData()
  }

  return (
    <Box
      className="flex flex-col xl:flex-row gap-5 sm:w-fit"
      paddingTop={"10px"}
      margin={"0 auto"}
    >
      <Box className="flex flex-row gap-5">
        <FormControl fullWidth>
          <InputLabel>Month</InputLabel>
          <Select
            className="w-full sm:w-[175px]"
            label="Month"
            value={transaction.month}
            name={"month"}
            onChange={(e) => handleMonth(e)}
          >
            {MONTHS.map((month) => {
              return <MenuItem value={month}>{month}</MenuItem>
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Year</InputLabel>
          <Select
            className="w-full sm:w-[175px]"
            label="Year"
            value={transaction.year.toString()}
            name={"year"}
            onChange={(e) => handleYear(e)}
          >
            {years.map((year) => {
              return (
                <MenuItem value={year.name.toString()}>
                  {year.name.toString()}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </Box>

      <Box className="flex flex-col sm:flex-row gap-5">
        <FormControl>
          <InputLabel>Category</InputLabel>
          <Select
            className="w-full sm:w-[175px]"
            label="Category"
            value={transaction.category}
            name={"category"}
            onChange={(e) => handleCategory(e)}
          >
            {categories.map((category) => {
              return <MenuItem value={category.name}>{category.name}</MenuItem>
            })}
          </Select>
        </FormControl>

        <MoneyInputV2
          value={transaction.amount}
          setValue={setTransaction}
          smallWidthBp={"sm"}
        />
      </Box>

      <Button
        variant={"contained"}
        disabled={transaction.amount === 0}
        onClick={save}
        sx={{
          backgroundColor: accentColorSecondary,
        }}
        loading={isLoading}
      >
        {`Add ${type}`}
      </Button>
    </Box>
  )
}

export default TransactionForm
