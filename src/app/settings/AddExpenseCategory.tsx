import EditDeleteListItem from "@/components/EditDeleteListItem"
import ShowCaseCard from "@/components/ShowCaseCard"
import SimpleForm from "@/components/SimpleForm"
import { Choice, useCategoryContext } from "@/contexts/categories-context"
import { EXPENSE_CATEGORIES_KEY } from "@/globals/globals"
import { saveChoices } from "@/utils/choiceStorage"
import { Box } from "@mui/material"
import { ChangeEvent, useState } from "react"

const AddExpenseCategory = (props: {
  setCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  setChoice: React.Dispatch<React.SetStateAction<Choice>>
}) => {
  const { 
    setCategoryDialogOpen,
    setChoice 
  } = props

  const {
    refreshExpenseCategoryChoices,
    expenseCategories,
    isMockData,
  } = useCategoryContext()

  const [expenseCategoriesInput, setExpenseCategoriesInput] = 
    useState<string>("")

  return (
    <ShowCaseCard title={"Add Expense Category"}>
      <Box 
        display={"flex"}
        flexDirection={"column"}
        height={"350px"}
        overflow={"hidden"}
        paddingTop={"1px"}
      >
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
        <Box
          flex={1}
          overflow={"auto"}
        >
          <EditDeleteListItem
            items={!isMockData.expensesCategories? expenseCategories : []}
            storageKey={EXPENSE_CATEGORIES_KEY}
            refresh={refreshExpenseCategoryChoices}
            setCategoryDialogOpen={setCategoryDialogOpen}
            setChoice={setChoice}
          />
        </Box>
      </Box>
    </ShowCaseCard>
  )
}

export default AddExpenseCategory