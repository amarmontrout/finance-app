"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import SimpleForm from "@/components/SimpleForm"
import { useTransactionContext } from "@/contexts/transactions-context"
import { EXPENSE_CATEGORIES_KEY, EXPENSES, INCOME, INCOME_CATEGORIES_KEY, YEARS_KEY } from "@/globals/globals"
import { loadData } from "@/utils/loadData"
import saveChoices from "@/utils/saveChoices"
import { saveData } from "@/utils/saveData"
import { Box, Button, Stack } from "@mui/material"
import { ChangeEvent, useState } from "react"

const Settings = () => {
  const [yearsInput, setYearsInput] = useState<string>("")
  const [incomeCategoriesInput, setIncomeCategoriesInput] = useState<string>("")
  const [expenseCategoriesInput, setExpenseCategoriesInput] = useState<string>("")

  const {
    refreshYearChoices,
    refreshIncomeCategoryChoices,
    refreshExpenseCategoryChoices
  } = useTransactionContext()

  return (
    <Box
      className="flex flex-col gap-2 h-full"
    >
      <Stack direction={"row"} gap={3} width={"fit-content"}>
        <Button 
          variant="contained"
          onClick={
            () => {
              saveData({keys: [
                "theme",
                YEARS_KEY,
                INCOME,
                INCOME_CATEGORIES_KEY,
                EXPENSES,
                EXPENSE_CATEGORIES_KEY
              ]})
            }
          }
        >
            Save Data
        </Button>
        
        <input
          type="file"
          accept=".txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            loadData(file)
              .then(() => {
                console.log("Data restored");
                window.location.reload(); // optional, but practical
              })
              .catch((err) => {
                console.error("Failed to load backup", err);
              });
          }}
        />
      </Stack>

      <Box
        className="flex flex-row gap-2 h-full"
      >
        <ShowCaseCard title={"Add Year"} secondaryTitle={""}>
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
        </ShowCaseCard>

        <ShowCaseCard title={"Add Income Category"} secondaryTitle={""}>
            <SimpleForm
              label={"Income Category"}
              value={incomeCategoriesInput}
              onChange={
                (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
                  {setIncomeCategoriesInput(e.target.value)}
              }
              onSubmit={
                () => {
                  saveChoices({key: INCOME_CATEGORIES_KEY, choice: incomeCategoriesInput})
                  refreshIncomeCategoryChoices()
                  setIncomeCategoriesInput("")
                }
              }
            />

        </ShowCaseCard>

        <ShowCaseCard title={"Add Expense Category"} secondaryTitle={""}>
            <SimpleForm
              label={"Expense Category"}
              value={expenseCategoriesInput}
              onChange={
                (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
                {setExpenseCategoriesInput(e.target.value)}
              }
              onSubmit={
                () => {
                  saveChoices({key: EXPENSE_CATEGORIES_KEY, choice: expenseCategoriesInput})
                  refreshExpenseCategoryChoices
                  setExpenseCategoriesInput("")
                }
              }
            />

        </ShowCaseCard>      
      </Box>
    </Box>
  )
}

export default Settings