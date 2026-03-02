import { AlertToastType } from "@/utils/type"
import { Alert, Snackbar } from "@mui/material"

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
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default AlertToast
