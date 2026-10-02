import { Alert, AlertColor, Snackbar } from "@mui/material"

export type AlertToastType = {
  open: boolean
  onClose: () => void
  severity: AlertColor
  message: string
}

const AlertToast = ({
  alertToast,
}: {
  alertToast: AlertToastType | undefined
}) => {
  if (alertToast === undefined) {
    return
  }

  const { open, onClose, severity, message } = alertToast

  return (
    <Snackbar
      open={open}
      autoHideDuration={2500}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{ bottom: "72px" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant={"filled"}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default AlertToast
