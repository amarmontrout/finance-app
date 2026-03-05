import { MoneyInputV2 } from "@/components/MoneyInput"
import { MONTHS } from "@/globals/globals"
import {
  HookSetter,
  ChoiceTypeV2,
  NewTransactionType,
  DateType,
} from "@/utils/type"
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  OutlinedInput,
  Autocomplete,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import { ChangeEvent, RefObject, useEffect, useState } from "react"
import { getDaysInMonth } from "./functions"

const NewTransactionForm = ({
  transaction,
  setTransaction,
  allNotes,
  categories,
  today,
  openDialog,
  inputRef,
}: {
  transaction: NewTransactionType
  setTransaction: HookSetter<NewTransactionType>
  allNotes: string[]
  categories: ChoiceTypeV2[]
  today: DateType
  openDialog: boolean
  inputRef: RefObject<HTMLInputElement | null>
}) => {
  const [date, setDate] = useState<DateType>(today)
  const [noteValue, setNoteValue] = useState<string | null>(null)

  useEffect(() => {
    setTransaction((prev) => ({
      ...prev,
      date: date,
    }))
  }, [date, setTransaction])

  useEffect(() => {
    if (transaction.is_return) {
      setTransaction((prev) => ({
        ...prev,
        is_paid: false,
      }))
    }
  }, [transaction.is_return])

  const handleMonth = (e: SelectChangeEvent) => {
    const { value } = e.target
    setDate((prev) => ({
      ...prev,
      month: value,
    }))
  }

  const handleDay = (e: SelectChangeEvent<string>) => {
    const value = e.target.value
    setDate((prev) => ({ ...prev, day: Number(value) }))
  }

  const handleYear = (e: SelectChangeEvent<string>) => {
    setDate((prev) => ({ ...prev, year: Number(e.target.value) }))
  }

  const handleCategory = (e: SelectChangeEvent) => {
    const { value } = e.target
    setTransaction((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handlePaymentMethod = (e: SelectChangeEvent) => {
    const { value } = e.target
    setTransaction((prev) => ({
      ...prev,
      payment_method: value,
    }))
  }

  return (
    <Stack className="md:w-[50%] 2xl:w-[30%]" spacing={2} margin={"0 auto"}>
      {/* Money input */}
      {openDialog && (
        <MoneyInputV2
          value={transaction.amount}
          setValue={setTransaction}
          inputRef={inputRef}
          autoFocus={openDialog}
        />
      )}

      {/* Full date */}
      <Stack direction={"row"} spacing={1}>
        <FormControl
          sx={{
            width: "45%",
          }}
        >
          <InputLabel>Month</InputLabel>
          <Select
            label="Month"
            value={date.month}
            name={"month"}
            onChange={(e) => handleMonth(e)}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 5 * 39,
                },
              },
            }}
          >
            {MONTHS.map((month) => {
              return (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <FormControl sx={{ width: "25%" }}>
          <InputLabel>Day</InputLabel>
          <Select
            label="Day"
            value={(date.day ?? 1).toString()}
            onChange={handleDay}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 5 * 39,
                },
              },
            }}
          >
            {Array.from(
              { length: getDaysInMonth(date.month, date.year) },
              (_, i) => i + 1,
            ).map((day) => (
              <MenuItem key={day} value={day.toString()}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: "30%" }}>
          <InputLabel>Year</InputLabel>
          <Select
            label="Year"
            value={date.year.toString()}
            onChange={(e) => handleYear(e)}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 5 * 39,
                },
              },
            }}
          >
            {Array.from({ length: 21 }, (_, i) => date.year - 10 + i).map(
              (year) => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>
      </Stack>

      {/* Category and notes */}
      <Stack direction={"row"} spacing={1}>
        <FormControl fullWidth>
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

        <FormControl fullWidth>
          <Autocomplete
            className="w-full"
            freeSolo
            options={allNotes.map((option) => option)}
            value={noteValue}
            onChange={(_: any, newValue: string | null) => {
              setNoteValue(newValue)
            }}
            inputValue={transaction.note}
            onInputChange={(_, newInputValue) => {
              setTransaction((prev) => ({
                ...prev,
                note: newInputValue,
              }))
            }}
            renderInput={(params) => <TextField {...params} label="Note" />}
          />
        </FormControl>
      </Stack>

      {/* Expense payment method */}
      {transaction.type === "expense" && (
        <FormControl fullWidth>
          <InputLabel>Payment Method</InputLabel>
          <Select
            className="w-full"
            label="Payment Method"
            value={transaction.payment_method}
            name={"payment method"}
            onChange={(e) => handlePaymentMethod(e)}
          >
            <MenuItem value={"Debit"}>{"Debit"}</MenuItem>
            <MenuItem value={"Credit"}>{"Credit"}</MenuItem>
          </Select>
        </FormControl>
      )}

      {/* Is return or is paid */}
      {transaction.type === "expense" && (
        <Stack direction={"row"} spacing={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={transaction.is_return}
                sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setTransaction((prev) => ({
                    ...prev,
                    is_return: e.target.checked,
                  }))
                }}
              />
            }
            label="Is a return?"
          />
          {!transaction.is_return && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={transaction.is_paid}
                  sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setTransaction((prev) => ({
                      ...prev,
                      is_paid: e.target.checked,
                    }))
                  }}
                />
              }
              label="Is paid?"
            />
          )}
        </Stack>
      )}
    </Stack>
  )
}

export default NewTransactionForm
