import { saveExpenseCategory } from "@/app/api/Choices/requests"
import EditDeleteListItem from "@/components/EditDeleteListItem"
import ShowCaseCard from "@/components/ShowCaseCard"
import SimpleForm from "@/components/SimpleForm"
import { useUser } from "@/hooks/useUser"
import { makeId } from "@/utils/helperFunctions"
import { ChoiceType, HookSetter } from "@/utils/type"
import { Box } from "@mui/material"
import { ChangeEvent, useState } from "react"

const AddExpenseCategory = ({
  setCategoryDialogOpen,
  setChoice,
  expenseCategories,
  loadCategories,
  syncExpenseToBudget,
}: {
  setCategoryDialogOpen: HookSetter<boolean>
  setChoice: HookSetter<ChoiceType | null>
  expenseCategories: ChoiceType[]
  loadCategories: () => Promise<void>
  syncExpenseToBudget: (expense: string, userId: string) => Promise<void>
}) => {
  const user = useUser()

  const [expenseCategoriesInput, setExpenseCategoriesInput] =
    useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const save = async () => {
    if (!user) return
    setIsLoading(true)
    await saveExpenseCategory({
      userId: user.id,
      body: {
        id: makeId(),
        name: expenseCategoriesInput,
      },
    })
    await syncExpenseToBudget(expenseCategoriesInput, user.id)
    setIsLoading(false)
    loadCategories()
    setExpenseCategoriesInput("")
  }

  return (
    <ShowCaseCard title={""}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        height={"325px"}
        overflow={"hidden"}
        paddingTop={"1px"}
      >
        <SimpleForm
          label={"Add An Expense Category"}
          value={expenseCategoriesInput}
          onChange={(
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            setExpenseCategoriesInput(e.target.value)
          }}
          onSubmit={save}
          isLoading={isLoading}
        />
        <hr style={{ width: "100%" }} />
        <Box flex={1} overflow={"auto"} paddingRight={"10px"}>
          <EditDeleteListItem
            type={"expense"}
            items={expenseCategories}
            refresh={loadCategories}
            setCategoryDialogOpen={setCategoryDialogOpen}
            setChoice={setChoice}
          />
        </Box>
      </Box>
    </ShowCaseCard>
  )
}

export default AddExpenseCategory
