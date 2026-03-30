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
  Menu,
} from "@mui/material"
import { RefObject, useEffect, useMemo, useState } from "react"
import { getDaysInMonth } from "../app/(app)/experimental/functions"

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
            <TableRow>
              <TableCell align={"left"}>
                <Typography>Date</Typography>
              </TableCell>
              <TableCell align={"right"}>
                <Typography
                  sx={{ textDecorationLine: "underline" }}
                  onClick={(e) => handleOpen("date", e)}
                >
                  {`${transaction.date.month} ${transaction.date.day}, ${transaction.date.year}`}
                </Typography>
              </TableCell>
            </TableRow>

            {/* Category */}
            <TableRow>
              <TableCell align={"left"}>
                <Typography>Category</Typography>
              </TableCell>
              <TableCell align={"right"}>
                <Typography
                  sx={{ textDecorationLine: "underline" }}
                  onClick={(e) => handleOpen("category", e)}
                >
                  {transaction.category !== ""
                    ? transaction.category
                    : "Select Category"}
                </Typography>
              </TableCell>
            </TableRow>

            {/* Notes */}
            <TableRow>
              <TableCell align={"left"}>
                <Typography>Note</Typography>
              </TableCell>
              <TableCell align="right">
                {activeField === "note" ? (
                  <Autocomplete
                    freeSolo
                    options={allNotes.sort()}
                    inputValue={transaction.note}
                    onInputChange={(_, newValue) => {
                      setTransaction((prev) => ({
                        ...prev,
                        note: newValue,
                      }))
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
                          "& .MuiInputBase-root": {
                            fontSize: "16px",
                          },
                          "& input": {
                            padding: 0,
                            margin: 0,
                            fontSize: "16px",
                          },
                        }}
                      />
                    )}
                  />
                ) : (
                  <Typography
                    sx={{ textDecorationLine: "underline", cursor: "pointer" }}
                    onClick={(e) => handleOpen("note", e)}
                  >
                    {transaction.note !== "" ? transaction.note : "Add Note"}
                  </Typography>
                )}
              </TableCell>
            </TableRow>

            {/* Expense payment method */}
            {transaction.type === "expense" && (
              <TableRow>
                <TableCell align={"left"}>
                  <Typography>Payment Method</Typography>
                </TableCell>
                <TableCell align={"right"}>
                  <Typography
                    sx={{ textDecorationLine: "underline" }}
                    onClick={(e) => handleOpen("payment_method", e)}
                  >
                    {transaction.payment_method}
                  </Typography>
                </TableCell>
              </TableRow>
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

      <Menu
        anchorEl={anchorEl}
        open={activeField === "category"}
        onClose={handleClose}
        slotProps={{ list: { ...MENU_PROPS.PaperProps } }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {categories.map((category) => (
          <MenuItem
            key={category.name}
            selected={transaction.category === category.name}
            onClick={() => {
              updateTransaction("category")(category.name)
              handleClose()
            }}
          >
            {category.name}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={anchorEl}
        open={activeField === "payment_method"}
        onClose={handleClose}
        slotProps={{ list: { ...MENU_PROPS.PaperProps } }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          value={"Debit"}
          onClick={() => {
            updateTransaction("payment_method")("Debit")
            handleClose()
          }}
        >
          {"Debit"}
        </MenuItem>
        <MenuItem
          value={"Credit"}
          onClick={() => {
            updateTransaction("payment_method")("Credit")
            handleClose()
          }}
        >
          {"Credit"}
        </MenuItem>
      </Menu>

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
        <Paper sx={{ p: 2, width: 380 }}>
          {activeField === "date" && (
            <Stack direction="row" spacing={1}>
              {/* Full date */}
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
