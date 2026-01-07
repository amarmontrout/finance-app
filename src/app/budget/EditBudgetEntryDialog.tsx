import MoneyInput from "@/components/MoneyInput"
import { BudgetCategoryType, BudgetEntryType } from "@/contexts/budget-context"
import { lightMode, darkMode } from "@/globals/colors"
import { BUDGET_KEY } from "@/globals/globals"
import { updateBudgetEntries } from "@/utils/budgetStorage"
import { 
  Dialog, 
  DialogTitle, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Autocomplete, 
  TextField, 
  DialogActions, 
  Button, 
  DialogContent
} from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const EditBudgetEntryDialog = ({
  openEditDialog,
  setOpenEditDialog,
  notes,
  budgetCategories,
  selectedEntry,
  refreshBudgetEntries
}: {
  openEditDialog: boolean
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
  notes: string[]
  budgetCategories: BudgetCategoryType[]
  selectedEntry: BudgetEntryType | null
  refreshBudgetEntries: () => void
}) => {
  const { theme: currentTheme } = useTheme()

  const BUDGET_ENTRY_INIT: BudgetEntryType = {
    category: "",
    note: "",
    amount: "",
    createdAt: 0
  }

  const [updatedBudgetEntry, setUpdatedBudgetEntry] = 
    useState<BudgetEntryType>(BUDGET_ENTRY_INIT)
  const [noteValue, setNoteValue] = useState<string | null>(null)

  const refreshDialog = () => {
    if (selectedEntry) {
      setUpdatedBudgetEntry(selectedEntry)
    }
    setNoteValue(null)
  }

  useEffect(() => {
    refreshDialog()
  }, [selectedEntry])

  return (
    <Dialog open={openEditDialog}>
      <DialogTitle>
        {`Edit Budget Entry`}
      </DialogTitle>

      <DialogContent>
        <Box
          className="flex flex-col gap-5"
          padding={"10px"}
        >
          <FormControl>
            <InputLabel>Category</InputLabel>
            <Select
              className="w-full"
              label="Category"
              value={updatedBudgetEntry.category}
              name={"category"}
              onChange={e => 
                setUpdatedBudgetEntry(prev => ({
                  ...prev,
                  category: e.target.value,
                }))}
            >
              {budgetCategories.map((budget) => {
                return (
                  <MenuItem 
                    value={budget.category}
                  >
                    {budget.category}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <FormControl>
            <Autocomplete
              className="w-full"
              freeSolo
              options={notes.map((option) => option)}
              value={noteValue}
              onChange={(event: any, newValue: string | null) => {
                setNoteValue(newValue)
              }}
              inputValue={updatedBudgetEntry.note}
              onInputChange={(event, newInputValue) => {
                setUpdatedBudgetEntry(prev => ({
                  ...prev,
                  note: newInputValue,
                }))
              }}
              renderInput={(params) => 
                <TextField
                  {...params} 
                  label="Note" 
                />
              }
            />
          </FormControl> 

          <MoneyInput
            value={updatedBudgetEntry.amount}
            setValue={setUpdatedBudgetEntry}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button 
          variant={"contained"} 
          disabled={
            false
          }
          onClick={() => {
            updateBudgetEntries(BUDGET_KEY, updatedBudgetEntry)
            setOpenEditDialog(false)
            refreshBudgetEntries()
            refreshDialog()
          }}
          sx={{
            backgroundColor: currentTheme === "light" 
              ? [lightMode.success] 
              : [darkMode.success]
          }}
        >
          {"Update"}
        </Button>
        
        <Button 
          variant={"contained"} 
          disabled={
            false
          }
          onClick={() => {
            setOpenEditDialog(false)
            refreshDialog()
          }}
          sx={{
            backgroundColor: currentTheme === "light" 
              ? [lightMode.error] 
              : [darkMode.error]
          }}
        >
          {"Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditBudgetEntryDialog