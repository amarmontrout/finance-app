"use client"

import { 
  EXPENSE_CATEGORIES_KEY, 
  EXPENSES, 
  INCOME, 
  INCOME_CATEGORIES_KEY, 
  YEARS_KEY 
} from "@/globals/globals"
import { Box, Button, Stack } from "@mui/material"
import { useState } from "react"
import { accentColorSecondary } from "@/globals/colors"
import { useTheme } from "next-themes"
import FileUploadDialog from "./FileUploadDialog"
import { saveData } from "@/utils/appDataStorage"
import { Choice, useCategoryContext } from "@/contexts/categories-context"
import EditCategorySettingsDialog from "@/components/EditCategorySettingsDialog"
import AddYear from "./AddYear"
import AddIncomeCategory from "./AddIncomeCategory"
import AddExpenseCategory from "./AddExpenseCategory"
import AddBudget from "./AddBudget"

const CHOICE_INIT = {
  name: "", 
  isExcluded: false, 
  isRecurring: false
}

const Settings = () => {
  const { refreshExpenseCategoryChoices } = useCategoryContext()
  const { theme: currentTheme } = useTheme()

  const [choice, setChoice] = useState<Choice>(CHOICE_INIT)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false)

  return (
    <Box
      className="flex flex-col gap-2 h-full"
    >
      <Stack direction={"row"} gap={1} width={"fit-content"}>
        <Button 
          variant="contained"
          sx={{
            backgroundColor: accentColorSecondary
          }}
          onClick={
            () => {
              saveData({keys: [
                YEARS_KEY,
                INCOME,
                INCOME_CATEGORIES_KEY,
                EXPENSES,
                EXPENSE_CATEGORIES_KEY
              ]})
            }
          }
        >
            Download Data
        </Button>

        <Button 
          variant="contained"
          sx={{
            backgroundColor: accentColorSecondary
          }}
          onClick={
            () => {setDialogOpen(true)}
          }
        >
            Upload Data
        </Button>
      </Stack>

      <Box
        className="flex flex-col xl:flex-row gap-2 h-full"
      >
        <AddYear/>

        <AddIncomeCategory/>

        <AddExpenseCategory
          setCategoryDialogOpen={setCategoryDialogOpen}
          setChoice={setChoice}
        />
      </Box>

      <Box
        className="flex flex-col xl:flex-row xl:w-[33%] gap-2 h-full"
      >
        <AddBudget/>
      </Box>

      <FileUploadDialog
        dialogOpen={dialogOpen}
        currentTheme={currentTheme}
        setDialogOpen={setDialogOpen}
      />

      <EditCategorySettingsDialog
        categoryDialogOpen={categoryDialogOpen}
        setCategoryDialogOpen={setCategoryDialogOpen}
        choice={choice}
        storageKey={EXPENSE_CATEGORIES_KEY}
        refresh={refreshExpenseCategoryChoices}
      />
    </Box>
  )
}

export default Settings