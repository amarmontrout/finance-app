import EditDeleteListItem from "@/components/EditDeleteListItem"
import ShowCaseCard from "@/components/ShowCaseCard"
import SimpleForm from "@/components/SimpleForm"
import { useCategoryContext } from "@/contexts/categories-context"
import { YEARS_KEY } from "@/globals/globals"
import { saveChoices } from "@/utils/choiceStorage"
import { Box } from "@mui/material"
import { ChangeEvent, useState } from "react"

const AddYear = () => {
  const {
    refreshYearChoices,
    years,
    isMockData,
  } = useCategoryContext()

  const [yearsInput, setYearsInput] = useState<string>("")

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
          onSubmit={
            () => {
              saveChoices({key: YEARS_KEY, choice: yearsInput})
              refreshYearChoices()
              setYearsInput("")
            }
          }
        />
        <hr style={{ width: "100%" }} />
        <Box
          flex={1}
          overflow={"auto"}
          paddingRight={"10px"}
        >
          <EditDeleteListItem
            items={!isMockData.years? years : []}
            storageKey={YEARS_KEY}
            refresh={refreshYearChoices}
          />
        </Box>
      </Box>
    </ShowCaseCard>
  )
}

export default AddYear