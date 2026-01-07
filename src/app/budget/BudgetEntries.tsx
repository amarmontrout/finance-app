"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { BudgetCategoryType, BudgetEntryType } from "@/contexts/budget-context"
import { accentColorSecondary, darkMode, lightMode } from "@/globals/colors"
import { BUDGET_KEY } from "@/globals/globals"
import { saveBudgetEntries } from "@/utils/budgetStorage"
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import { 
  Box, 
  FormControl, 
  InputLabel,  
  Button, 
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  IconButton,
  Stack
} from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from "react"
import MoneyInput from "@/components/MoneyInput"

const BudgetEntries = ({
  budgetCategories, 
  refreshBudgetCategories,
  budgetEntries,
  refreshBudgetEntries,
  notes,
  setOpenEditDialog,
  setSelectedEntry,
  currentTheme
}: {
    budgetCategories: BudgetCategoryType[]
    refreshBudgetCategories: ()=> void
    budgetEntries: BudgetEntryType[]
    refreshBudgetEntries: () => void
    notes: string[]
    setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedEntry: React.Dispatch<React.SetStateAction<BudgetEntryType | null>>
    currentTheme: string | undefined
}) => {
  const BUDGET_ENTRY_INIT: BudgetEntryType = {
    category: budgetCategories.length !== 0 ? budgetCategories[0].category : "",
    note: "",
    amount: "",
    createdAt: 0
  }
  
  const [budgetEntry, setBudgetEntry] = 
    useState<BudgetEntryType>(BUDGET_ENTRY_INIT)
  const [noteValue, setNoteValue] = useState<string | null>(null)
  const [noteId, setNoteId] = useState<number | null>(null)

  const listItemColor = currentTheme === "light" ?
    lightMode.elevatedBg 
    : darkMode.elevatedBg

  useEffect(() => {
    refreshBudgetCategories()
  }, [])

  const handleCategory = (
    e: SelectChangeEvent
  ) => {
    const { value } = e.target
    setBudgetEntry(prev => ({
      ...prev,
      category: value,
    }));
  }

  const resetFormData = () => {
    setBudgetEntry(BUDGET_ENTRY_INIT)
  }

  const save = () => {
    saveBudgetEntries({
      key: BUDGET_KEY, 
      budgetEntry: {
        ...budgetEntry,
        createdAt: Date.now()
    }})
    refreshBudgetEntries()
    resetFormData()
  }

  const deleteEntry = (id: number) => {
    const updatedEntries = budgetEntries.filter((entry) => {
      return entry.createdAt !== id
    })
    saveBudgetEntries({key: BUDGET_KEY, updatedEntry: updatedEntries})
    refreshBudgetEntries()
  }

  const EditDeleteButton = ({ id, entry }: {id: number, entry: BudgetEntryType}) => {
    return (
      <Stack direction={"row"} gap={2}>
        <IconButton 
          edge="end"
          onClick={
            () => {
              setOpenEditDialog(true)
              setSelectedEntry(entry)
            }
          }
        >
          <EditIcon/>
        </IconButton>

        <IconButton 
          edge="end"
          onClick={
            () => {
              setNoteId(id)
            }
          }
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    )
  }

  const ConfirmCancel = ({ id }: { id: number }) => {
    return (
      <Stack direction={"row"} gap={2}>
        <IconButton 
          edge="end"
          onClick={
            () => {
              deleteEntry(id)
              setNoteId(null)
            }
          }
        >
          <DeleteIcon/>
        </IconButton>

        <IconButton 
          edge="end"
          onClick={
            () => {
              setSelectedEntry(null)
              setNoteId(null)
            }
          }
        >
          <CancelIcon/>
        </IconButton>
      </Stack>
    )
  }

  return (
    <ShowCaseCard title={"Enter Expenses for the Week"}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        overflow={"hidden"}
        paddingTop={"5px"}
      >
        <Box className="flex flex-col lg:flex-row gap-2 pb-[12px]">
          <FormControl>
            <InputLabel>Category</InputLabel>
            <Select
              className="w-full lg:w-[175px]"
              label="Category"
              value={budgetEntry.category}
              name={"category"}
              onChange={e => handleCategory(e)}
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
              className="w-full lg:w-[175px]"
              freeSolo
              options={notes.map((option) => option)}
              value={noteValue}
              onChange={(event: any, newValue: string | null) => {
                setNoteValue(newValue);
              }}
              inputValue={budgetEntry.note}
              onInputChange={(event, newInputValue) => {
                setBudgetEntry(prev => ({
                  ...prev,
                  note: newInputValue,
                }));
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
            value={budgetEntry.amount}
            setValue={setBudgetEntry}
            smallWidthBp={"lg"}
          /> 

          <Button
            variant={"contained"} 
            disabled={
              false
            }
            onClick={save}
            sx={{
              backgroundColor: accentColorSecondary
            }}
          >
            {"Add"}
          </Button>
        </Box>

        <hr style={{ width: "100%" }} />

        <Box
          flex={1}
          overflow={"auto"}
        >
          <List className="flex flex-col gap-2">
            { budgetEntries &&
              (budgetEntries).map((entry) => {                 
                return (
                  <ListItem
                    key={`${entry.category}-${entry.note}-${entry.amount}`} 
                    secondaryAction={
                    noteId === entry.createdAt
                      ? <ConfirmCancel id={entry.createdAt}/> 
                      : <EditDeleteButton id={entry.createdAt} entry={entry}/>
                    }
                    sx={{ 
                      backgroundColor: listItemColor,
                      borderRadius: "15px"
                    }}
                  >
                    <ListItemText 
                      primary={`$${entry.amount} - ${entry.note}`} 
                      secondary={entry.category}
                    />
                  </ListItem>
                )
              })
            }
          </List>
        </Box>
      </Box>
    </ShowCaseCard>
  )
}

export default BudgetEntries