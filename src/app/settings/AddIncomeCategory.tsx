import EditDeleteListItem from "@/components/EditDeleteListItem"
import ShowCaseCard from "@/components/ShowCaseCard"
import SimpleForm from "@/components/SimpleForm"
import { useCategoryContext } from "@/contexts/categories-context"
import { INCOME_CATEGORIES_KEY } from "@/globals/globals"
import { saveChoices } from "@/utils/choiceStorage"
import { Box } from "@mui/material"
import { ChangeEvent, useState } from "react"

const AddIncomeCategory = () => {
  const {
    refreshIncomeCategoryChoices,
    incomeCategories,
    isMockData,
  } = useCategoryContext()

  const [incomeCategoriesInput, setIncomeCategoriesInput] = 
    useState<string>("")

  return (
    <ShowCaseCard title={"Add Income Category"}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        height={"350px"}
        overflow={"hidden"}
        paddingTop={"1px"}
      >
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
        <Box
          flex={1}
          overflow={"auto"}
        >
          <EditDeleteListItem
            items={!isMockData.incomeCategories? incomeCategories : []}
            storageKey={INCOME_CATEGORIES_KEY}
            refresh={refreshIncomeCategoryChoices}
          />          
        </Box>
      </Box>
    </ShowCaseCard>
  )
}

export default AddIncomeCategory