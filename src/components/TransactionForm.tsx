import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { PickerValue } from "@mui/x-date-pickers/internals"
import dayjs from "dayjs"
import { useState } from "react"

const TransactionForm = () => {
  const today = Date()
  const [date, setDate] = useState<PickerValue>(dayjs(today))
  const [category, setCategory] = useState<string>("Paycheck")
  const [amount, setAmount] = useState<string>()

  return (
    <Box
      border={"1px solid blue"}
      width={"fit-content"}
      padding={"10px"}
    >
      <Stack
        direction={"column"}
        gap={2}
      >
        <Typography variant="h5">Add Income</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={"Pick date"}
            value={date}
            onChange={(newDate) => {setDate(newDate)}}
          />
        </LocalizationProvider>
        <FormControl>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={category}
            onChange={(selection: SelectChangeEvent) => {setCategory(selection.target.value as string)}}
          >
            <MenuItem value={"Paycheck"}>Paycheck</MenuItem>
            <MenuItem value={"Misc"}>Misc</MenuItem>
          </Select>
      </FormControl>
      <TextField
        label={"Amount"}
        value={amount}
        onChange={(input) => {setAmount(input.target.value)}}
      />
      </Stack>
    </Box>
  )
}

export default TransactionForm