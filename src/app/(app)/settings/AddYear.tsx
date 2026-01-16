import { saveYearChoice } from "@/app/api/Choices/requests"
import EditDeleteListItem from "@/components/EditDeleteListItem"
import ShowCaseCard from "@/components/ShowCaseCard"
import SimpleForm from "@/components/SimpleForm"
import { useCategoryContext } from "@/contexts/categories-context"
import { useUser } from "@/hooks/useUser"
import { makeId } from "@/utils/helperFunctions"
import { Box } from "@mui/material"
import { ChangeEvent, useState } from "react"

const AddYear = () => {
  const { refreshYearChoicesV2, yearsV2 } = useCategoryContext()
  const user = useUser()

  const [yearsInput, setYearsInput] = useState<string>("")

  const save = async () => {
    if (!user) return
    await saveYearChoice({
      userId: user.id,
      body: {
        id: Number(makeId(8)),
        name: yearsInput
      }
    })
    refreshYearChoicesV2()
    setYearsInput("")
  }

  return (
    <ShowCaseCard title={"Add Year"}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        height={"325px"}
        overflow={"hidden"}
        paddingTop={"1px"}
      >
        <SimpleForm
          label={"Year"}
          value={yearsInput}
          onChange={
            (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
              {setYearsInput(e.target.value)}
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
            type={"year"}
            items={yearsV2}
            refresh={refreshYearChoicesV2}
          />
        </Box>
      </Box>
    </ShowCaseCard>
  )
}

export default AddYear