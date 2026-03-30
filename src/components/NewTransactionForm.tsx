import MoneyInput from "@/components/MoneyInput"
import { MONTHS } from "@/globals/globals"
import {
  HookSetter,
  ChoiceType,
  NewTransactionType,
  DateType,
} from "@/utils/type"
import {
  Stack,
  Select,
  MenuItem,
  Checkbox,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  Typography,
  TableCell,
} from "@mui/material"
import { RefObject, useEffect, useMemo, useState } from "react"
import { getDaysInMonth } from "../app/(app)/experimental/functions"
import NoteAutocomplete from "./NoteAutocomplete"
import CategoryAutocomplete from "./CategoryAutocomplete"

const MENU_PROPS = {
  PaperProps: {
    style: {
      maxHeight: 7 * 39,
    },
  },
}

const Row = ({
  label,
  value,
  onClick,
}: {
  label: string
  value: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}) => {
  return (
    <TableRow>
      <TableCell>
        <Typography>{label}</Typography>
      </TableCell>
      <TableCell
        align="right"
        onClick={onClick}
        sx={{
          textDecorationLine: onClick ? "underline" : "none",
          cursor: onClick ? "pointer" : "default",
        }}
      >
        {value}
      </TableCell>
    </TableRow>
  )
}

const TransactionDatePicker = ({
  date,
  days,
  years,
  onChange,
}: {
  date: DateType
  days: number[]
  years: number[]
  onChange: (field: keyof DateType, value: string | number) => void
}) => {
  return (
    <Stack
      direction={"row"}
      spacing={1}
      justifyContent={"flex-end"}
      maxHeight={24}
    >
      <Select
        size="small"
        variant="standard"
        value={date.month}
        MenuProps={MENU_PROPS.PaperProps}
        onChange={(e) => onChange("month", e.target.value)}
      >
        {MONTHS.map((m) => (
          <MenuItem key={m} value={m}>
            {m}
          </MenuItem>
        ))}
      </Select>

      <Select
        size="small"
        variant="standard"
        value={date.day ?? 1}
        MenuProps={MENU_PROPS.PaperProps}
        onChange={(e) => onChange("day", Number(e.target.value))}
      >
        {days.map((d) => (
          <MenuItem key={d} value={d}>
            {d}
          </MenuItem>
        ))}
      </Select>

      <Select
        size="small"
        variant="standard"
        value={date.year}
        MenuProps={MENU_PROPS.PaperProps}
        onChange={(e) => onChange("year", Number(e.target.value))}
      >
        {years.map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  )
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
  categories: ChoiceType[]
  openDialog: boolean
  inputRef: RefObject<HTMLInputElement | null>
  currentYear: number
}) => {
  const { month, year } = transaction.date

  const [activeField, setActiveField] = useState<
    "date" | "category" | "note" | "payment_method" | null
  >(null)

  const handleOpen = (field: typeof activeField) => {
    setActiveField(field)
  }

  const handleClose = () => {
    setActiveField(null)
  }

  const { days, years } = useMemo(() => {
    const days = Array.from(
      { length: getDaysInMonth(month, year) },
      (_, i) => i + 1,
    )
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)
    return { days, years }
  }, [month, year, currentYear])

  const sortedNotes = useMemo(() => [...allNotes].sort(), [allNotes])

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
  }, [month, year, setTransaction, transaction.date.day])

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
    <Stack className="md:w-[50%] 2xl:w-[30%]" spacing={2}>
      {/* Money input */}
      {openDialog && (
        <MoneyInput
          value={transaction.amount}
          setValue={setTransaction}
          inputRef={inputRef}
          autoFocus={openDialog}
        />
      )}

      <TableContainer>
        <Table>
          <TableBody>
            {/* Full date */}
            <Row
              label="Date"
              value={
                activeField === "date" ? (
                  <TransactionDatePicker
                    date={transaction.date}
                    days={days}
                    years={years}
                    onChange={(field, value) => updateDate(field)(value)}
                  />
                ) : (
                  <Typography>
                    {`${transaction.date.month} ${transaction.date.day}, ${transaction.date.year}`}
                  </Typography>
                )
              }
              onClick={
                activeField !== "date" ? () => handleOpen("date") : undefined
              }
            />

            {/* Category */}
            <Row
              label="Category"
              value={
                activeField === "category" ? (
                  <CategoryAutocomplete
                    transaction={transaction}
                    setTransaction={setTransaction}
                    categories={categories}
                    handleClose={handleClose}
                  />
                ) : (
                  <Typography>
                    {transaction.category || "Select Category"}
                  </Typography>
                )
              }
              onClick={
                activeField !== "category"
                  ? () => handleOpen("category")
                  : undefined
              }
            />

            {/* Notes */}
            <Row
              label="Note"
              value={
                activeField === "note" ? (
                  <NoteAutocomplete
                    transaction={transaction}
                    setTransaction={setTransaction}
                    sortedNotes={sortedNotes}
                    handleClose={handleClose}
                  />
                ) : transaction.note !== "" ? (
                  <Typography>{transaction.note}</Typography>
                ) : (
                  <Typography>Add Note</Typography>
                )
              }
              onClick={
                activeField !== "note" ? () => handleOpen("note") : undefined
              }
            />

            {/* Expense payment method */}
            {transaction.type === "expense" && (
              <Row
                label="Payment Method"
                value={
                  <Typography>
                    {transaction.payment_method || "Debit"}
                  </Typography>
                }
                onClick={() =>
                  updateTransaction("payment_method")(
                    transaction.payment_method === "Debit" ? "Credit" : "Debit",
                  )
                }
              />
            )}

            {/* Is return */}
            {transaction.type === "expense" && (
              <TableRow>
                <TableCell align={"left"}>
                  <Typography>Return</Typography>
                </TableCell>
                <TableCell align={"right"}>
                  <Checkbox
                    sx={{
                      width: 16,
                      height: 16,
                    }}
                    disableRipple
                    checked={transaction.is_return}
                    onChange={(e) =>
                      updateTransaction("is_return")(e.target.checked)
                    }
                  />
                </TableCell>
              </TableRow>
            )}

            {/* Is paid */}
            {transaction.type === "expense" && !transaction.is_return && (
              <TableRow>
                <TableCell align={"left"}>
                  <Typography>Paid</Typography>
                </TableCell>
                <TableCell align={"right"}>
                  <Checkbox
                    sx={{
                      width: 16,
                      height: 16,
                    }}
                    disableRipple
                    checked={transaction.is_paid}
                    onChange={(e) =>
                      updateTransaction("is_paid")(e.target.checked)
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

export default NewTransactionForm
