import { darkMode, lightMode } from "@/globals/colors"
import { loadData } from "@/utils/appDataStorage"
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material"

const FileUploadDialog = (props: {
  dialogOpen: boolean
  currentTheme: string | undefined
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {

  const {
    dialogOpen,
    currentTheme,
    setDialogOpen
  } = props

  return (
    <Dialog open={dialogOpen}>
      <DialogContent 
        sx={{
          backgroundColor: currentTheme === "light" ?
           lightMode.elevatedBg 
           : darkMode.elevatedBg,
        }}
      >
        <input
          type="file"
          accept=".json,application/json"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            loadData(file)
              .then(() => {
                console.log("Data restored")
                window.location.reload()
              })
              .catch((err) => {
                console.error("Failed to load backup", err)
              })
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          variant="contained"
          sx={{
            backgroundColor: currentTheme === "light" ?
             lightMode.error 
             : darkMode.error
          }}
          onClick={
            () => {setDialogOpen(false)}
          }
        >
            Cancel
        </Button>
      </DialogActions>
    </Dialog> 
  )
}

export default FileUploadDialog