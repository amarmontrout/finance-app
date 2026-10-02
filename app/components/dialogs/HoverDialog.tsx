import { BACKGROUND, TEXT_COLOR } from "@/app/data/colors"
import CloseIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material"
import { ReactNode } from "react"
import Center from "../Center"

const HoverDialog = ({
  open,
  onClose,
  onSave,
  title,
  content,
  showButtons,
}: {
  open: boolean
  onClose: () => void
  onSave?: () => void
  title: string
  content: ReactNode
  showButtons: boolean
}) => {
  return (
    <Dialog
      maxWidth={"lg"}
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick") {
          onClose()
        }
      }}
      sx={{ "& .MuiDialog-paper": { backgroundColor: BACKGROUND } }}
    >
      <Box>
        <Toolbar>
          <Stack
            direction={"row"}
            sx={{
              width: "100%",
              height: "100%",
              justifyContent: showButtons ? "space-between" : "center",
              alignItems: "center",
            }}
          >
            {showButtons && (
              <IconButton
                onClick={onClose}
                sx={{ height: "fit-content", color: TEXT_COLOR }}
              >
                <CloseIcon />
              </IconButton>
            )}

            <Typography>{title}</Typography>

            {showButtons && (
              <IconButton
                onClick={onSave}
                sx={{ height: "fit-content", color: TEXT_COLOR }}
              >
                <SaveIcon />
              </IconButton>
            )}
          </Stack>
        </Toolbar>

        <DialogContent>
          <Center>{content}</Center>
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default HoverDialog
