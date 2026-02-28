import { updateExpenseCategory } from "@/app/api/Choices/requests"
import { darkMode, lightMode } from "@/globals/colors"
import { useUser } from "@/hooks/useUser"
import { ChoiceTypeV2 } from "@/utils/type"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material"
import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"

const EditCategorySettingsDialog = ({
  categoryDialogOpen,
  setCategoryDialogOpen,
  choice,
  refresh,
}: {
  categoryDialogOpen: boolean
  setCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  choice: ChoiceTypeV2 | null
  refresh: () => void
}) => {
  const { theme: currentTheme } = useTheme()
  const user = useUser()

  const [localChoice, setLocalChoice] = useState<ChoiceTypeV2 | null>(null)

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

  const handleChangeExclude = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalChoice((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        isExcluded: event.target.checked,
      }
    })
  }

  const update = async () => {
    if (!user || !localChoice) return
    await updateExpenseCategory({
      userId: user.id,
      rowId: localChoice.id,
      body: localChoice,
    })
    refresh()
    setCategoryDialogOpen(false)
  }

  if (!localChoice) return null

  return (
    <Dialog open={categoryDialogOpen}>
      <DialogTitle>{`Category Settings`}</DialogTitle>

      <DialogContent>
        <Typography>{localChoice.name}</Typography>
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

          <FormControlLabel
            control={
              <Switch
                checked={localChoice.isExcluded}
                onChange={handleChangeExclude}
              />
            }
            label="Exclude"
          />
        </FormGroup>
      </DialogContent>

      <DialogActions>
        <Stack direction={"row"} gap={1} justifyContent={"right"}>
          <Button
            variant={"contained"}
            onClick={update}
            sx={{
              backgroundColor:
                currentTheme === "light"
                  ? [lightMode.success]
                  : [darkMode.success],
            }}
          >
            {"Update"}
          </Button>

          <Button
            variant={"contained"}
            onClick={() => {
              setCategoryDialogOpen(false)
              setLocalChoice(null)
            }}
            sx={{
              backgroundColor:
                currentTheme === "light" ? [lightMode.error] : [darkMode.error],
            }}
          >
            {"Cancel"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default EditCategorySettingsDialog
