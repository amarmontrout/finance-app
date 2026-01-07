import { Choice } from "@/contexts/categories-context"
import { darkMode, lightMode } from "@/globals/colors"
import { updateChoice } from "@/utils/choiceStorage"
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
  Typography
} from "@mui/material"
import { useTheme } from "next-themes"
import React, { useEffect } from "react"

const EditCategorySettingsDialog = ({ 
    categoryDialogOpen, 
    setCategoryDialogOpen, 
    choice, 
    storageKey, 
    refresh 
  }: {
  categoryDialogOpen: boolean
  setCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  choice: Choice
  storageKey: string
  refresh: () => void
}) => {
  const {theme: currentTheme} = useTheme()

  const [localChoice, setLocalChoice] = React.useState<Choice>(choice)

  useEffect(() => {
    setLocalChoice(choice)
  }, [choice])

  const handleChangeRecurring = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalChoice((prev) => ({
      ...prev,
      isRecurring: event.target.checked,
    }))
  }

  
  const handleChangeExclude = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalChoice((prev) => ({
      ...prev,
      isExcluded: event.target.checked,
    }))
  }

  return (
    <Dialog open={categoryDialogOpen}>
      <DialogTitle>
        {`Category Settings`}
      </DialogTitle>

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
            label="Exclude from Calculations"
          />
        </FormGroup>
      </DialogContent>

      <DialogActions>
        <Stack direction={"row"} gap={1} justifyContent={"right"}>
          <Button 
            variant={"contained"} 
            onClick={() => {
              updateChoice(storageKey, localChoice)
              refresh()
              setCategoryDialogOpen(false)
            }}
            sx={{
              backgroundColor: currentTheme === "light" 
                ? [lightMode.success] 
                : [darkMode.success]
            }}
          >
            {"Update"}
          </Button>

          <Button 
            variant={"contained"}
            onClick={() => {
              setCategoryDialogOpen(false)
            }}
            sx={{
              backgroundColor: currentTheme === "light" 
                ? [lightMode.error] 
                : [darkMode.error]
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