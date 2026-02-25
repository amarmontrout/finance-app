import { saveBudget } from "@/app/api/Transactions/requests"
import FullDate from "@/components/FullDate"
import { MoneyInputV2 } from "@/components/MoneyInput"
import { accentColorSecondary } from "@/globals/colors"
import { makeId } from "@/utils/helperFunctions"
import { BudgetTransactionTypeV2, BudgetTypeV2, DateType } from "@/utils/type"
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
  Button,
  SelectChangeEvent,
} from "@mui/material"
import { User } from "@supabase/supabase-js"
import { ChangeEvent, useState } from "react"

const BudgetEntryForm = ({
  budgetCategories,
  today,
  user,
  refreshBudgetTransactions,
  week,
  notes,
}: {
  budgetCategories: BudgetTypeV2[]
  today: DateType
  user: User | null
  refreshBudgetTransactions: () => void
  week: "prev" | "current"
  notes: string[]
}) => {
  const BUDGET_ENTRY_INIT: BudgetTransactionTypeV2 = {
    id: Number(makeId(8)),
    category: budgetCategories.length !== 0 ? budgetCategories[0].category : "",
    note: "",
    amount: 0,
    isReturn: false,
    date: today,
  }

  const [budgetEntry, setBudgetEntry] =
    useState<BudgetTransactionTypeV2>(BUDGET_ENTRY_INIT)
  const [noteValue, setNoteValue] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleCategory = (e: SelectChangeEvent) => {
    const { value } = e.target
    setBudgetEntry((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const resetFormData = () => {
    setBudgetEntry(BUDGET_ENTRY_INIT)
  }

  const save = async () => {
    if (!user) return
    setIsLoading(true)
    await saveBudget({
      userId: user.id,
      body: {
        ...budgetEntry,
      },
    })
    setIsLoading(false)
    refreshBudgetTransactions()
    resetFormData()
  }

  return (
    <Box
      className="flex flex-col lg:flex-row gap-5 mt-1"
      paddingTop={"10px"}
      margin={"0 auto"}
    >
      <FullDate
        today={today}
        setBudgetEntry={setBudgetEntry}
        disabled={week === "prev"}
      />

      <FormControl>
        <InputLabel>Category</InputLabel>
        <Select
          className="w-full lg:w-[175px]"
          label="Category"
          value={budgetEntry.category}
          name={"category"}
          onChange={(e) => handleCategory(e)}
          disabled={week === "prev"}
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
          disabled={week === "prev"}
          options={notes.map((option) => option)}
          value={noteValue}
          onChange={(event: any, newValue: string | null) => {
            setNoteValue(newValue)
          }}
          inputValue={budgetEntry.note}
          onInputChange={(event, newInputValue) => {
            setBudgetEntry((prev) => ({
              ...prev,
              note: newInputValue,
            }))
          }}
          renderInput={(params) => <TextField {...params} label="Note" />}
        />
      </FormControl>

      <MoneyInputV2
        value={budgetEntry.amount}
        setValue={setBudgetEntry}
        smallWidthBp={"lg"}
        disabled={week === "prev"}
      />

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

      <Button
        variant={"contained"}
        disabled={week === "prev"}
        onClick={save}
        sx={{
          backgroundColor: accentColorSecondary,
        }}
        loading={isLoading}
      >
        {"Add"}
      </Button>
    </Box>
  )
}

export default BudgetEntryForm
