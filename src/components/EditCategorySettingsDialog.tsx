import { Choice } from "@/contexts/categories-context"
import { darkMode, lightMode } from "@/globals/colors"
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
import React from "react"

const EditCategorySettingsDialog = (props: {
  categoryDialogOpen: boolean
  setCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  choice: Choice
}) => {
  const { categoryDialogOpen, setCategoryDialogOpen, choice } = props
  const {theme: currentTheme} = useTheme()

  return (
    <Dialog open={categoryDialogOpen}>
      <DialogTitle>
        {`Category Settings`}
      </DialogTitle>

      <DialogContent>
        <Typography>{choice.name}</Typography>
        <FormGroup>
          <FormControlLabel 
            control={
              <Switch checked={choice.isRecurring} />
            } 
            label="Recurring"
          />

          <FormControlLabel 
            control={
              <Switch checked={choice.isExcluded} />
            } 
            label="Exclude from Calculations"
          />
        </FormGroup>
      </DialogContent>

      <DialogActions>
        <Stack direction={"row"} gap={1} justifyContent={"right"}>
          <Button 
            variant={"contained"} 
            onClick={() => {}}
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