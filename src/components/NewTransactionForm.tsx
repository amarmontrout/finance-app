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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Checkbox,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  Typography,
  TableCell,
  Popover,
  Paper,
} from "@mui/material"
import { MouseEvent, RefObject, useEffect, useMemo, useState } from "react"
import { getDaysInMonth } from "../app/(app)/experimental/functions"

const MENU_PROPS = {
  PaperProps: {
    style: {
      maxHeight: 5 * 39,
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

const CategoryAutocomplete = ({
  transaction,
  setTransaction,
  categories,
  handleClose,
}: {
  transaction: NewTransactionType
  setTransaction: HookSetter<NewTransactionType>
  categories: ChoiceType[]
  handleClose?: () => void
}) => {
  return (
    <Autocomplete
      options={categories.map((c) => c.name)}
      value={transaction.category || ""}
      onChange={(_, newValue) => {
        if (newValue !== null) {
          setTransaction((prev) => ({ ...prev, category: newValue }))
        }
      }}
      onClose={handleClose}
      openOnFocus
      popupIcon={null}
      freeSolo={false}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          autoFocus
          placeholder="Select Category"
          sx={{
            fontSize: "16px",
            maxHeight: 24,
            "& .MuiInputBase-root": { fontSize: "16px" },
            "& input": { padding: 0, margin: 0, fontSize: "16px" },
          }}
        />
      )}
    />
  )
}

const NoteAutocomplete = ({
  transaction,
  setTransaction,
  sortedNotes,
  handleClose,
}: {
  transaction: NewTransactionType
  setTransaction: HookSetter<NewTransactionType>
  sortedNotes: string[]
  handleClose?: () => void
}) => {
  return (
    <Autocomplete
      freeSolo
      options={sortedNotes}
      inputValue={transaction.note}
      onInputChange={(_, newValue) => {
        setTransaction((prev) => ({ ...prev, note: newValue }))
      }}
      onClose={handleClose}
      openOnFocus
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          autoFocus
          placeholder="Add Note"
          sx={{
            fontSize: "16px",
            maxHeight: 24,
            "& .MuiInputBase-root": { fontSize: "16px" },
            "& input": {
              padding: 0,
              margin: 0,
              fontSize: "16px",
            },
          }}
        />
      )}
    />
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

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [activeField, setActiveField] = useState<
    "date" | "category" | "note" | "payment_method" | null
  >(null)

  const handleOpen = (
    field: typeof activeField,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setAnchorEl(event.currentTarget)
    setActiveField(field)
  }

  const handleClose = () => {
    setAnchorEl(null)
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
                <Typography>
                  {`${transaction.date.month} ${transaction.date.day}, ${transaction.date.year}`}
                </Typography>
              }
              onClick={(e: MouseEvent<HTMLElement>) => handleOpen("date", e)}
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
                  ? (e) => handleOpen("category", e)
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
                activeField !== "note"
                  ? (e) => handleOpen("note", e)
                  : undefined
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

      <Popover
        open={activeField === "date"}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Paper sx={{ p: 2 }}>
          {activeField === "date" && (
            <Stack direction="row" spacing={1}>
              {/* Full date */}
              <FormControl>
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

              <FormControl>
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

              <FormControl>
                <InputLabel>Year</InputLabel>
                <Select
                  label="Year"
                  value={transaction.date.year}
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
          )}
        </Paper>
      </Popover>
    </Stack>
  )
}

export default NewTransactionForm
