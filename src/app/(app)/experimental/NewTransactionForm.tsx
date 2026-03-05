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
  Autocomplete,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import { RefObject, useEffect, useMemo } from "react"
import { getDaysInMonth } from "./functions"

const MENU_PROPS = {
  PaperProps: {
    style: {
      maxHeight: 5 * 39,
    },
  },
}

const NewTransactionForm = ({
  transaction,
  setTransaction,
  allNotes,
  categories,
  openDialog,
  inputRef,
  currentYear,
}: {
  transaction: NewTransactionType
  setTransaction: HookSetter<NewTransactionType>
  allNotes: string[]
  categories: ChoiceTypeV2[]
  openDialog: boolean
  inputRef: RefObject<HTMLInputElement | null>
  currentYear: number
}) => {
  const { month, year } = transaction.date

  const days = useMemo(
    () => Array.from({ length: getDaysInMonth(month, year) }, (_, i) => i + 1),
    [month, year],
  )

  const years = useMemo(
    () => Array.from({ length: 21 }, (_, i) => currentYear - 10 + i),
    [currentYear],
  )

  useEffect(() => {
    if (transaction.is_return) {
      setTransaction((prev) => ({
        ...prev,
        is_paid: false,
      }))
    }
  }, [transaction.is_return, setTransaction])

  useEffect(() => {
    const maxDay = getDaysInMonth(month, year)
    if ((transaction.date.day ?? 1) > maxDay) {
      updateDate("day")(maxDay)
    }
  }, [month, year, setTransaction])

  const updateTransaction =
    (field: keyof NewTransactionType) => (value: string | number | boolean) =>
      setTransaction((prev) => ({
        ...prev,
        [field]: value,
      }))

  const updateDate = (field: keyof DateType) => (value: string | number) =>
    setTransaction((prev) => ({
      ...prev,
      date: {
        ...prev.date,
        [field]: value,
      },
    }))

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
            value={transaction.date.month}
            onChange={(e) => updateDate("month")(e.target.value)}
            MenuProps={MENU_PROPS}
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
            value={transaction.date.day ?? 1}
            onChange={(e) => updateDate("day")(Number(e.target.value))}
            MenuProps={MENU_PROPS}
          >
            {days.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: "30%" }}>
          <InputLabel>Year</InputLabel>
          <Select
            label="Year"
            value={transaction.date.year.toString()}
            onChange={(e) => updateDate("year")(Number(e.target.value))}
            MenuProps={MENU_PROPS}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
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
            onChange={(e) => updateTransaction("category")(e.target.value)}
            MenuProps={MENU_PROPS}
          >
            {categories.map((category) => (
              <MenuItem key={category.name} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <Autocomplete
            className="w-full"
            freeSolo
            options={allNotes}
            inputValue={transaction.note}
            onInputChange={(_, newInputValue) => {
              setTransaction((prev) => ({
                ...prev,
                note: newInputValue,
              }))
            }}
            slotProps={{
              listbox: {
                sx: {
                  maxHeight: 5 * 39,
                  overflow: "auto",
                },
              },
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
            onChange={(e) =>
              updateTransaction("payment_method")(e.target.value)
            }
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
                onChange={(e) =>
                  updateTransaction("is_return")(e.target.checked)
                }
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
                  onChange={(e) =>
                    updateTransaction("is_paid")(e.target.checked)
                  }
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
