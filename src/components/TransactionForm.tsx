"use client"

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material"
import { RefObject, useEffect } from "react"
import { MONTHS } from "@/globals/globals"
import { MoneyInputV2 } from "./MoneyInput"
import { ChoiceTypeV2, HookSetter, TransactionTypeV2 } from "@/utils/type"
import { makeId } from "@/utils/helperFunctions"

const TransactionForm = ({
  transaction,
  setTransaction,
  categories,
  years,
  currentMonth,
  currentYear,
  openAddTransactionDialog,
  inputRef,
}: {
  transaction: TransactionTypeV2
  setTransaction: HookSetter<TransactionTypeV2>
  categories: ChoiceTypeV2[]
  years: ChoiceTypeV2[]
  currentMonth: string
  currentYear: number
  openAddTransactionDialog: boolean
  inputRef: RefObject<HTMLInputElement | null>
}) => {
  useEffect(() => {
    if (!categories.length) return

    setTransaction({
      id: Number(makeId(8)),
      month: currentMonth,
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

  return (
    <Stack className="md:w-[50%] 2xl:w-[30%]" spacing={3} margin={"0 auto"}>
      {openAddTransactionDialog && (
        <MoneyInputV2
          value={transaction.amount}
          setValue={setTransaction}
          inputRef={inputRef}
          autoFocus={openAddTransactionDialog}
        />
      )}

      <Stack direction={"row"} spacing={1}>
        <FormControl fullWidth>
          <InputLabel>Month</InputLabel>
          <Select
            className="w-full"
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
            className="w-full"
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
      </Stack>

      <FormControl>
        <InputLabel>Category</InputLabel>
        <Select
          className="w-full"
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
    </Stack>
  )
}

export default TransactionForm
