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
import { ChangeEvent, RefObject, useEffect, useMemo, useState } from "react"

const NewTransactionForm = ({
  transaction,
  setTransaction,
  allTransactions,
  categories,
  today,
  openDialog,
  inputRef,
}: {
  transaction: NewTransactionType
  setTransaction: HookSetter<NewTransactionType>
  allTransactions: NewTransactionType[]
  categories: ChoiceTypeV2[]
  today: DateType
  openDialog: boolean
  inputRef: RefObject<HTMLInputElement | null>
}) => {
  const [date, setDate] = useState<DateType>(today)
  const [noteValue, setNoteValue] = useState<string | null>(null)
  const [paymentMethodValue, setPaymentMethodValue] = useState<string | null>(
    null,
  )

  const allNotes = useMemo(() => {
    return [...new Set(allTransactions.map((e) => e.note))]
  }, [allTransactions])

  const paymentMethods = useMemo(() => {
    return [...new Set(allTransactions.map((e) => e.payment_method))]
  }, [allTransactions])

  useEffect(() => {
    setTransaction((prev) => ({
      ...prev,
      date: date,
    }))
  }, [date, setTransaction])

  const handleMonth = (e: SelectChangeEvent) => {
    const { value } = e.target
    setDate((prev) => ({
      ...prev,
      month: value,
    }))
  }

  const handleDay = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let digits = e.target.value.replace(/\D/g, "")
    if (digits.length <= 2) {
      setDate((prev) => ({
        ...prev,
        day: Number(digits),
      }))
    }
  }

  const handleYear = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let digits = e.target.value.replace(/\D/g, "")
    if (digits.length <= 4) {
      setDate((prev) => ({
        ...prev,
        year: Number(digits),
      }))
    }
  }

  const handleCategory = (e: SelectChangeEvent) => {
    const { value } = e.target
    setTransaction((prev) => ({
      ...prev,
      category: value,
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

        <FormControl
          sx={{
            width: "25%",
          }}
        >
          <InputLabel>Day</InputLabel>
          <OutlinedInput
            label={"Day"}
            value={date.day}
            name={"day"}
            onChange={(e) => handleDay(e)}
          />
        </FormControl>

        <FormControl
          sx={{
            width: "30%",
          }}
        >
          <InputLabel>Year</InputLabel>
          <OutlinedInput
            label={"Year"}
            value={date.year}
            name={"year"}
            onChange={(e) => handleYear(e)}
          />
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
          <Autocomplete
            className="w-full"
            freeSolo
            options={paymentMethods.map((option) => option)}
            value={paymentMethodValue}
            onChange={(_: any, newValue: string | null) => {
              setPaymentMethodValue(newValue)
            }}
            inputValue={transaction.payment_method}
            onInputChange={(_, newInputValue) => {
              setTransaction((prev) => ({
                ...prev,
                payment_method: newInputValue,
              }))
            }}
            renderInput={(params) => (
              <TextField {...params} label="Payment method" />
            )}
          />
        </FormControl>
      )}

      {/* Is return or is paid */}
      {transaction.type === "income" ? (
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
      ) : (
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
  )
}

export default NewTransactionForm
