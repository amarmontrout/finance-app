import { saveYearChoice } from "@/app/api/Choices/requests"
import EditDeleteListItem from "@/components/EditDeleteListItem"
import ShowCaseCard from "@/components/ShowCaseCard"
import SimpleForm from "@/components/SimpleForm"
import { useUser } from "@/hooks/useUser"
import { makeId } from "@/utils/helperFunctions"
import { ChoiceTypeV2 } from "@/utils/type"
import { Box } from "@mui/material"
import { ChangeEvent, useState } from "react"

const AddYear = ({
  yearsV2,
  loadCategories,
}: {
  yearsV2: ChoiceTypeV2[]
  loadCategories: () => Promise<void>
}) => {
  const user = useUser()

  const [yearsInput, setYearsInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const save = async () => {
    if (!user) return
    setIsLoading(true)
    await saveYearChoice({
      userId: user.id,
      body: {
        id: makeId(),
        name: yearsInput,
      },
    })
    setIsLoading(false)
    loadCategories()
    setYearsInput("")
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
          label={"Add A Year"}
          value={yearsInput}
          onChange={(
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            setYearsInput(e.target.value)
          }}
          onSubmit={save}
          isLoading={isLoading}
        />
        <hr style={{ width: "100%" }} />
        <Box flex={1} overflow={"auto"} paddingRight={"10px"}>
          <EditDeleteListItem
            type={"year"}
            items={yearsV2}
            refresh={loadCategories}
          />
        </Box>
      </Box>
    </ShowCaseCard>
  )
}

export default AddYear
