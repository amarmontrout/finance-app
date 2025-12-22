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
import EditDeleteListItem from "@/components/EditDeleteListItem"

const Settings = () => {
  const [yearsInput, setYearsInput] = useState<string>("")
  const [incomeCategoriesInput, setIncomeCategoriesInput] = useState<string>("")
  const [expenseCategoriesInput, setExpenseCategoriesInput] = useState<string>("")

  const {
    refreshYearChoices,
    refreshIncomeCategoryChoices,
    refreshExpenseCategoryChoices,
    years,
    incomeCategories,
    expenseCategories,
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
            items={years}
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
                saveChoices({key: INCOME_CATEGORIES_KEY, choice: incomeCategoriesInput})
                refreshIncomeCategoryChoices()
                setIncomeCategoriesInput("")
              }
            }
          />

          <hr style={{ width: "100%" }} />

          <EditDeleteListItem
            items={incomeCategories}
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
                saveChoices({key: EXPENSE_CATEGORIES_KEY, choice: expenseCategoriesInput})
                refreshExpenseCategoryChoices()
                setExpenseCategoriesInput("")
              }
            }
          />

          <hr style={{ width: "100%" }} />

          <EditDeleteListItem
            items={expenseCategories}
            storageKey={EXPENSE_CATEGORIES_KEY}
            refresh={refreshExpenseCategoryChoices}
          />
        </ShowCaseCard>      
      </Box>
    </Box>
  )
}

export default Settings