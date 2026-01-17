import { saveExpenseCategory } from "@/app/api/Choices/requests"
import EditDeleteListItem from "@/components/EditDeleteListItem"
import ShowCaseCard from "@/components/ShowCaseCard"
import SimpleForm from "@/components/SimpleForm"
import { useCategoryContext } from "@/contexts/categories-context"
import { useUser } from "@/hooks/useUser"
import { makeId } from "@/utils/helperFunctions"
import { ChoiceTypeV2, HookSetter } from "@/utils/type"
import { Box } from "@mui/material"
import { ChangeEvent, useState } from "react"

const AddExpenseCategory = ({ 
  setCategoryDialogOpen,
  setChoice 
}: {
  setCategoryDialogOpen: HookSetter<boolean>
  setChoice: HookSetter<ChoiceTypeV2 | null>
}) => {
  const {
    expenseCategoriesV2,
    refreshExpenseCategoryChoicesV2
  } = useCategoryContext()
  const user = useUser()

  const [expenseCategoriesInput, setExpenseCategoriesInput] = 
    useState<string>("")

  const save = async () => {
    if (!user) return
    await saveExpenseCategory({
      userId: user.id,
      body: {
        id: Number(makeId(8)),
        name: expenseCategoriesInput
      }
    })
    refreshExpenseCategoryChoicesV2()
    setExpenseCategoriesInput("")
  }

  return (
    <ShowCaseCard title={"Add Expense Category"}>
      <Box 
        display={"flex"}
        flexDirection={"column"}
        height={"325px"}
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
          onSubmit={save}
        />
        <hr style={{ width: "100%" }} />
        <Box
          flex={1}
          overflow={"auto"}
          paddingRight={"10px"}
        >
          <EditDeleteListItem
            type={"expense"}
            items={expenseCategoriesV2}
            refresh={refreshExpenseCategoryChoicesV2}
            setCategoryDialogOpen={setCategoryDialogOpen}
            setChoice={setChoice}
          />
        </Box>
      </Box>
    </ShowCaseCard>
  )
}

export default AddExpenseCategory