import { updateExpenseCategory } from "@/app/api/Choices/requests"
import { useUser } from "@/hooks/useUser"
import { AlertToastType, ChoiceType, HookSetter } from "@/utils/type"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material"
import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"
import CloseIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"

const EditCategorySettingsDialog = ({
  categoryDialogOpen,
  setCategoryDialogOpen,
  choice,
  refresh,
  setAlertToast,
}: {
  categoryDialogOpen: boolean
  setCategoryDialogOpen: HookSetter<boolean>
  choice: ChoiceType | null
  refresh: () => Promise<void>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const user = useUser()

  const [localChoice, setLocalChoice] = useState<ChoiceType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (categoryDialogOpen && choice) {
      setLocalChoice(choice)
    }
  }, [choice, categoryDialogOpen])

  const handleChangeRecurring = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLocalChoice((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        isRecurring: event.target.checked,
      }
    })
  }

  const handleUpdateExpenseCategoryData = async () => {
    if (!user || !localChoice) return
    setIsLoading(true)
    try {
      await updateExpenseCategory({
        userId: user.id,
        rowId: localChoice.id,
        body: localChoice,
      })
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "success",
        message: "Category updated successfully!",
      })
    } catch (error) {
      console.error(error)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: "Category could not be updated.",
      })
    } finally {
      await refresh()
      setIsLoading(false)
      setCategoryDialogOpen(false)
    }
  }

  if (!localChoice) return null

  return (
    <Dialog open={categoryDialogOpen}>
      <DialogTitle>
        <Stack
          width={"100%"}
          height={"100%"}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <IconButton
            onClick={() => {
              setCategoryDialogOpen(false)
              setLocalChoice(null)
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography>{`Edit ${localChoice.name}`}</Typography>
          <IconButton
            // loading={isLoading}
            onClick={handleUpdateExpenseCategoryData}
          >
            <SaveIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={localChoice.isRecurring}
                onChange={handleChangeRecurring}
              />
            }
            label="Recurring"
          />
        </FormGroup>
      </DialogContent>
    </Dialog>
  )
}

export default EditCategorySettingsDialog
