import { saveYearChoice } from "@/app/api/Choices/requests"
import EditDeleteListItem from "@/components/EditDeleteListItem"
import ShowCaseCard from "@/components/ShowCaseCard"
import SimpleForm from "@/components/SimpleForm"
import { useUser } from "@/hooks/useUser"
import { makeId } from "@/utils/helperFunctions"
import { ChoiceType } from "@/utils/type"
import { Box } from "@mui/material"
import { ChangeEvent, useState } from "react"

const AddYear = ({
  years,
  loadCategories,
}: {
  years: ChoiceType[]
  loadCategories: () => Promise<void>
}) => {
  const user = useUser()

  const [yearsInput, setYearsInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target

    setYearsInput(value)
  }

  const save = async () => {
    if (!user) return

    const yearExists = years.some((y) => y.name === yearsInput)
    if (!/^\d{4}$/.test(yearsInput) || yearExists) return

    setIsLoading(true)
    await saveYearChoice({
      userId: user.id,
      body: { id: makeId(), name: yearsInput },
    })
    await loadCategories()
    setYearsInput("")
    setIsLoading(false)
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
          onChange={handleChange}
          onSubmit={save}
          isLoading={isLoading}
          isDisabled={
            !/^\d{4}$/.test(yearsInput) ||
            years.some((y) => y.name === yearsInput)
          }
        />
        <hr style={{ width: "100%" }} />
        <Box flex={1} overflow={"auto"} paddingRight={"10px"}>
          <EditDeleteListItem
            type={"year"}
            items={years}
            refresh={loadCategories}
          />
        </Box>
      </Box>
    </ShowCaseCard>
  )
}

export default AddYear
