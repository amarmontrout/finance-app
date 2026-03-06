import {
  deleteIncomeCategory,
  saveIncomeCategory,
} from "@/app/api/Choices/requests"
import ListItemSwipe from "@/components/ListItemSwipe"
import ShowCaseCard from "@/components/ShowCaseCard"
import SimpleForm from "@/components/SimpleForm"
import { useUser } from "@/hooks/useUser"
import { makeId } from "@/utils/helperFunctions"
import { AlertToastType, ChoiceType, HookSetter } from "@/utils/type"
import { Box, Collapse, Stack } from "@mui/material"
import { useTheme } from "next-themes"
import { ChangeEvent, useState } from "react"
import { TransitionGroup } from "react-transition-group"

const AddIncomeCategory = ({
  incomeCategories,
  loadCategories,
  setAlertToast,
}: {
  incomeCategories: ChoiceType[]
  loadCategories: () => Promise<void>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const user = useUser()
  const { theme: currentTheme } = useTheme()

  const [incomeCategoriesInput, setIncomeCategoriesInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [confirmSelection, setConfirmSelection] = useState<number | null>(null)

  const handleDeleteEntry = async (id: number) => {
    if (!user || !id) return
    try {
      await deleteIncomeCategory({
        userId: user.id,
        rowId: id,
      })
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "success",
        message: "Income category deleted successfully!",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "error",
        message: "Income Category could not be deleted.",
      })
    } finally {
      await loadCategories()
    }
  }

  const save = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      await saveIncomeCategory({
        userId: user.id,
        body: {
          id: makeId(),
          name: incomeCategoriesInput,
        },
      })
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "success",
        message: "Year saved successfully!",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: "Year could not be saved.",
      })
    } finally {
      await loadCategories()
      setIsLoading(false)
      setIncomeCategoriesInput("")
    }
  }

  return (
    <ShowCaseCard title={""}>
      <Stack height={"325px"} spacing={1}>
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

        <Stack spacing={1.5} overflow={"auto"}>
          <TransitionGroup>
            {incomeCategories.map((entry, index) => {
              const isLast = index === incomeCategories.length - 1
              return (
                <Collapse key={entry.id}>
                  <Box mb={isLast ? 0 : 1}>
                    <ListItemSwipe
                      mainTitle={entry.name}
                      secondaryTitle={""}
                      amount={""}
                      amountColor={"inherit"}
                      buttonCondition={confirmSelection === entry.id}
                      onDelete={async () => {
                        handleDeleteEntry(entry.id)
                      }}
                      onSetDelete={() => {
                        setConfirmSelection(entry.id)
                      }}
                      onCancelDelete={() => {
                        setConfirmSelection(null)
                      }}
                      onEdit={() => {}}
                      currentTheme={currentTheme}
                    />
                  </Box>
                </Collapse>
              )
            })}
          </TransitionGroup>
        </Stack>
      </Stack>
    </ShowCaseCard>
  )
}

export default AddIncomeCategory
