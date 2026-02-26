import { saveIncomeCategory } from "@/app/api/Choices/requests"
import EditDeleteListItem from "@/components/EditDeleteListItem"
import ShowCaseCard from "@/components/ShowCaseCard"
import SimpleForm from "@/components/SimpleForm"
import { useCategoryContext } from "@/contexts/categories-context"
import { useUser } from "@/hooks/useUser"
import { makeId } from "@/utils/helperFunctions"
import { Box } from "@mui/material"
import { ChangeEvent, useState } from "react"

const AddIncomeCategory = () => {
  const { incomeCategoriesV2, refreshIncomeCategoryChoicesV2 } =
    useCategoryContext()
  const user = useUser()

  const [incomeCategoriesInput, setIncomeCategoriesInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const save = async () => {
    if (!user) return
    setIsLoading(true)
    await saveIncomeCategory({
      userId: user.id,
      body: {
        id: Number(makeId(8)),
        name: incomeCategoriesInput,
      },
    })
    setIsLoading(false)
    refreshIncomeCategoryChoicesV2()
    setIncomeCategoriesInput("")
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
          label={"Add An Income Category"}
          value={incomeCategoriesInput}
          onChange={(
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            setIncomeCategoriesInput(e.target.value)
          }}
          onSubmit={save}
          isLoading={isLoading}
        />
        <hr style={{ width: "100%" }} />
        <Box flex={1} overflow={"auto"} paddingRight={"10px"}>
          <EditDeleteListItem
            type={"income"}
            items={incomeCategoriesV2}
            refresh={refreshIncomeCategoryChoicesV2}
          />
        </Box>
      </Box>
    </ShowCaseCard>
  )
}

export default AddIncomeCategory
