import FullDate from "@/components/FullDate"
import { MoneyInputV2 } from "@/components/MoneyInput"
import { makeId } from "@/utils/helperFunctions"
import {
  BudgetTransactionTypeV2,
  BudgetTypeV2,
  DateType,
  HookSetter,
} from "@/utils/type"
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
} from "@mui/material"
import { ChangeEvent, useEffect } from "react"

const BudgetEntryForm = ({
  budgetEntry,
  setBudgetEntry,
  noteValue,
  setNoteValue,
  budgetCategories,
  today,
  notes,
}: {
  budgetEntry: BudgetTransactionTypeV2
  setBudgetEntry: HookSetter<BudgetTransactionTypeV2>
  noteValue: string | null
  setNoteValue: HookSetter<string | null>
  budgetCategories: BudgetTypeV2[]
  today: DateType
  notes: string[]
}) => {
  useEffect(() => {
    if (!budgetCategories.length) return

    setBudgetEntry({
      id: Number(makeId(8)),
      category: budgetCategories[0].category,
      note: "",
      amount: 0,
      isReturn: false,
      date: today,
    })
  }, [budgetCategories])

  const handleCategory = (e: SelectChangeEvent) => {
    const { value } = e.target
    setBudgetEntry((prev) => ({
      ...prev,
      category: value,
    }))
  }

  return (
    <Box
      className="flex flex-col lg:flex-row gap-5 mt-1"
      paddingTop={"10px"}
      margin={"0 auto"}
    >
      <MoneyInputV2 value={budgetEntry.amount} setValue={setBudgetEntry} />

      <FullDate today={today} setBudgetEntry={setBudgetEntry} />

      <FormControl>
        <InputLabel>Category</InputLabel>
        <Select
          className="w-full lg:w-[175px]"
          label="Category"
          value={budgetEntry.category}
          name={"category"}
          onChange={(e) => handleCategory(e)}
        >
          {budgetCategories.map((budget) => {
            return (
              <MenuItem value={budget.category}>{budget.category}</MenuItem>
            )
          })}
        </Select>
      </FormControl>

      <FormControl>
        <Autocomplete
          className="w-full lg:w-[175px]"
          freeSolo
          options={notes.map((option) => option)}
          value={noteValue}
          onChange={(_: any, newValue: string | null) => {
            setNoteValue(newValue)
          }}
          inputValue={budgetEntry.note}
          onInputChange={(_, newInputValue) => {
            setBudgetEntry((prev) => ({
              ...prev,
              note: newInputValue,
            }))
          }}
          renderInput={(params) => <TextField {...params} label="Note" />}
        />
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            checked={budgetEntry.isReturn}
            sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setBudgetEntry((prev) => ({
                ...prev,
                isReturn: e.target.checked,
              }))
            }}
          />
        }
        label="Is a return?"
      />
    </Box>
  )
}

export default BudgetEntryForm
