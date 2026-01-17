"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { accentColorSecondary, darkMode, lightMode } from "@/globals/colors"
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
import { useState } from "react"
import { MoneyInputV2 } from "@/components/MoneyInput"
import { BudgetTransactionTypeV2, BudgetTypeV2, HookSetter } from "@/utils/type"
import { makeId } from "@/utils/helperFunctions"
import { deleteBudget, saveBudget } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"

const BudgetEntries = ({
  budgetCategories, 
  budgetTransactions,
  refreshBudgetTransactions,
  notes,
  setOpenEditDialog,
  setSelectedEntry,
  currentTheme,
  week
}: {
    budgetCategories: BudgetTypeV2[]
    budgetTransactions: BudgetTransactionTypeV2[]
    refreshBudgetTransactions: () => void
    notes: string[]
    setOpenEditDialog: HookSetter<boolean>
    setSelectedEntry: HookSetter<BudgetTransactionTypeV2 | null>
    currentTheme: string | undefined
    week: "prev" | "current"
}) => {
  const BUDGET_ENTRY_INIT: BudgetTransactionTypeV2 = {
    id: Number(makeId(8)),
    category: budgetCategories.length !== 0 ? budgetCategories[0].category : "",
    note: "",
    amount: 0,
    createdAt: 0
  }

  const user = useUser()
  
  const [budgetEntry, setBudgetEntry] = 
    useState<BudgetTransactionTypeV2>(BUDGET_ENTRY_INIT)
  const [noteValue, setNoteValue] = useState<string | null>(null)
  const [noteId, setNoteId] = useState<number | null>(null)

  const listItemColor = currentTheme === "light" ?
    lightMode.elevatedBg 
    : darkMode.elevatedBg

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

  const save = async () => {
    if (!user) return
    await saveBudget({
      userId: user.id,
      body: {
        ...budgetEntry,
        createdAt: Date.now()
      }
    })
    refreshBudgetTransactions()
    resetFormData()
  }

  const deleteEntry = async (id: number) => {
    if (!user) return
    await deleteBudget({
      userId: user?.id,
      rowId: id
    })
    refreshBudgetTransactions()
  }

  const EditDeleteButton = ({ 
    id, 
    entry 
  }: {
    id: number, 
    entry: BudgetTransactionTypeV2
  }) => {
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
    <ShowCaseCard title={"Budget Expenses"}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        overflow={"hidden"}
        paddingTop={"5px"}
      >
        <Box className="flex flex-col lg:flex-row gap-3 pb-[12px]">
          <FormControl>
            <InputLabel>Category</InputLabel>
            <Select
              className="w-full lg:w-[175px]"
              label="Category"
              value={budgetEntry.category}
              name={"category"}
              onChange={e => handleCategory(e)}
              disabled={week === "prev"}
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
              disabled={week === "prev"}
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

          <MoneyInputV2
            value={budgetEntry.amount}
            setValue={setBudgetEntry}
            smallWidthBp={"lg"}
            disabled={week === "prev"}
          /> 

          <Button
            variant={"contained"} 
            disabled={week === "prev"}
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
            { budgetTransactions &&
              (budgetTransactions).map((entry) => {                 
                return (
                  <ListItem
                    key={entry.id} 
                    secondaryAction={
                    noteId === entry.id
                      ? <ConfirmCancel id={entry.id}/> 
                      : <EditDeleteButton id={entry.id} entry={entry}/>
                    }
                    sx={{ 
                      backgroundColor: listItemColor,
                      borderRadius: "15px"
                    }}
                  >
                    <ListItemText 
                      primary={`$${entry.amount.toFixed(2)} - ${entry.note}`} 
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