"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import SimpleForm from "@/components/SimpleForm"
import { 
  EXPENSE_CATEGORIES_KEY, 
  EXPENSES, 
  INCOME, 
  INCOME_CATEGORIES_KEY, 
  YEARS_KEY 
} from "@/globals/globals"
import { Box, Button, Stack } from "@mui/material"
import { ChangeEvent, useState } from "react"
import EditDeleteListItem from "@/components/EditDeleteListItem"
import { accentColorSecondary } from "@/globals/colors"
import { useTheme } from "next-themes"
import FileUploadDialog from "./FileUploadDialog"
import { saveChoices } from "@/utils/choiceStorage"
import { saveData } from "@/utils/appDataStorage"
import { Choice, useCategoryContext } from "@/contexts/categories-context"
import EditCategorySettingsDialog from "@/components/EditCategorySettingsDialog"

const Settings = () => {
  const {
    refreshYearChoices,
    refreshIncomeCategoryChoices,
    refreshExpenseCategoryChoices,
    years,
    incomeCategories,
    expenseCategories,
    isMockData,
  } = useCategoryContext()
  const { theme: currentTheme } = useTheme()

  const [yearsInput, setYearsInput] = useState<string>("")
  const [incomeCategoriesInput, setIncomeCategoriesInput] = 
    useState<string>("")
  const [expenseCategoriesInput, setExpenseCategoriesInput] = 
    useState<string>("")
  const [choice, setChoice] = 
    useState<Choice>({name: "", isExcluded: false, isRecurring: false})
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
        <ShowCaseCard title={"Add Year"}>
          <SimpleForm
            label={"Year"}
            value={yearsInput}
            onChange={
              (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
                {setYearsInput(e.target.value)}
            }
            onSubmit={
              () => {
                saveChoices({key: YEARS_KEY, choice: yearsInput})
                refreshYearChoices()
                setYearsInput("")
              }
            }
          />

          <hr style={{ width: "100%" }} />

          <EditDeleteListItem
            items={!isMockData.years? years : []}
            storageKey={YEARS_KEY}
            refresh={refreshYearChoices}
          />
        </ShowCaseCard>

        <ShowCaseCard title={"Add Income Category"}>
          <SimpleForm
            label={"Income Category"}
            value={incomeCategoriesInput}
            onChange={
              (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
                {setIncomeCategoriesInput(e.target.value)}
            }
            onSubmit={
              () => {
                saveChoices({
                  key: INCOME_CATEGORIES_KEY, 
                  choice: incomeCategoriesInput
                })
                refreshIncomeCategoryChoices()
                setIncomeCategoriesInput("")
              }
            }
          />

          <hr style={{ width: "100%" }} />

          <EditDeleteListItem
            items={!isMockData.incomeCategories? incomeCategories : []}
            storageKey={INCOME_CATEGORIES_KEY}
            refresh={refreshIncomeCategoryChoices}
          />
        </ShowCaseCard>

        <ShowCaseCard title={"Add Expense Category"}>
          <SimpleForm
            label={"Expense Category"}
            value={expenseCategoriesInput}
            onChange={
              (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
              {setExpenseCategoriesInput(e.target.value)}
            }
            onSubmit={
              () => {
                saveChoices({
                  key: EXPENSE_CATEGORIES_KEY, 
                  choice: expenseCategoriesInput
                })
                refreshExpenseCategoryChoices()
                setExpenseCategoriesInput("")
              }
            }
          />

          <hr style={{ width: "100%" }} />

          <EditDeleteListItem
            items={!isMockData.expensesCategories? expenseCategories : []}
            storageKey={EXPENSE_CATEGORIES_KEY}
            refresh={refreshExpenseCategoryChoices}
            setCategoryDialogOpen={setCategoryDialogOpen}
            setChoice={setChoice}
          />
        </ShowCaseCard>      
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