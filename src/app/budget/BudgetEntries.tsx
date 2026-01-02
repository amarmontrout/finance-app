"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { BudgetCategoryType, BudgetEntryType } from "@/contexts/budget-context"
import { accentColorSecondary, darkMode, lightMode } from "@/globals/colors"
import { BUDGET_KEY } from "@/globals/globals"
import { saveBudgetEntries } from "@/utils/budgetStorage"
import { 
  Box, 
  FormControl, 
  InputLabel, 
  OutlinedInput, 
  InputAdornment, 
  Button, 
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  SelectChangeEvent
} from "@mui/material"
import { useTheme } from "next-themes"
import { ChangeEvent, useEffect, useState } from "react"

const BudgetEntries = ({
  budgetCategories, 
  refreshBudgetCategories,
  budgetEntries,
  refreshBudgetEntries
}: {
    budgetCategories: BudgetCategoryType[]
    refreshBudgetCategories: ()=> void
    budgetEntries: BudgetEntryType[]
    refreshBudgetEntries: () => void
}) => {
  const BUDGET_ENTRY_INIT: BudgetEntryType = {
    category: budgetCategories.length !== 0 ? budgetCategories[0].category : "",
    note: "",
    amount: "",
    createdAt: 0
  }
  
  const [budgetEntry, setBudgetEntry] = 
    useState<BudgetEntryType>(BUDGET_ENTRY_INIT)

  const { theme: currentTheme } = useTheme()
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

  const handleNote = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target
    setBudgetEntry(prev => ({
      ...prev,
      note: value,
    }));
  }  

  const handleAmount = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let digits = e.target.value.replace(/\D/g, "");
    const cents = digits.slice(-2);
    let dollars = digits.slice(0, -2);
    dollars = dollars.replace(/^0+/, "");
    const formatted = `${dollars}.${cents}`;

    if (formatted.length <= 7) {
      setBudgetEntry(prev => ({
        ...prev,
        amount: dollars || cents ? formatted : "",
      }));
    }
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
            <InputLabel>Note</InputLabel>
            <OutlinedInput
              className="w-full lg:w-[175px]"
              label={"Note"}
              value={budgetEntry.note}
              name={"note"}
              onChange={e => handleNote(e)}
            />
          </FormControl>           

          <FormControl>
            <InputLabel>Amount</InputLabel>
            <OutlinedInput
              className="w-full lg:w-[175px]"
              label={"Amount"}
              value={budgetEntry.amount}
              name={"amount"}
              onChange={e => handleAmount(e)}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
            />
          </FormControl> 

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
                    sx={{ 
                      backgroundColor: listItemColor,
                      borderRadius: "10px"
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