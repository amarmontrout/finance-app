import { BACKGROUND, TEXT_COLOR } from "@/app/data/colors"
import CloseIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"
import {
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material"
import { ReactNode } from "react"
import Center from "../Center"

const FullScreenDialog = ({
  open,
  onClose,
  onSave,
  disableSave,
  title,
  content,
}: {
  open: boolean
  onClose: () => void
  onSave: () => void
  disableSave?: boolean
  title: string
  content: ReactNode
}) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      sx={{ "& .MuiDialog-paper": { backgroundColor: BACKGROUND } }}
    >
      <Toolbar>
        <Stack
          direction={"row"}
          sx={{
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{ height: "fit-content", color: TEXT_COLOR }}
          >
            <CloseIcon />
          </IconButton>

          <Typography>{title}</Typography>

          <IconButton
            onClick={onSave}
            disabled={disableSave}
            sx={{ height: "fit-content", color: TEXT_COLOR }}
          >
            <SaveIcon />
          </IconButton>
        </Stack>
      </Toolbar>

      <DialogContent>
        <Center>{content}</Center>
      </DialogContent>
    </Dialog>
  )
}

export default FullScreenDialog
