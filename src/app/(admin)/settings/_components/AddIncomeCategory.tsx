import { ChoiceType } from "@/api/choices/models"
import {
  deleteIncomeCategory,
  saveIncomeCategory,
} from "@/api/choices/requests"
import { neutralColor } from "@/global/colors"
import ListItemSwipe from "@/global/components/ListItemSwipe"
import { makeId } from "@/global/infoFunctions"
import { useUser } from "@/hooks/use-user"
import { AlertToastType, HookSetter } from "@/types/types"
import { Divider, Stack } from "@mui/material"
import { useTheme } from "next-themes"
import { ChangeEvent, useState } from "react"
import SimpleForm from "./SimpleForm"

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
    <Stack spacing={1} sx={{ height: "406px" }}>
      <SimpleForm
        placeholder={"Add An Income Category"}
        value={incomeCategoriesInput}
        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setIncomeCategoriesInput(e.target.value)
        }}
        onSubmit={save}
        isLoading={isLoading}
      />

      <Stack
        divider={
          <Divider
            orientation={"horizontal"}
            sx={{ borderColor: neutralColor.bg }}
          />
        }
      >
        {incomeCategories.map((entry, index) => {
          return (
            <ListItemSwipe
              key={entry.id}
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
              noEdit={true}
            />
          )
        })}
      </Stack>
    </Stack>
  )
}

export default AddIncomeCategory
