import { accentColorPrimary } from "@/globals/colors"
import { IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

const AddDataButton = ({ action }: { action: () => void }) => {
  return (
    <IconButton
      onClick={action}
      size="large"
      disableRipple
      sx={{
        position: "fixed",
        right: "10px",
        bottom: "95px",
        backgroundColor: accentColorPrimary,
        color: "white",
        zIndex: 100,
        boxShadow: `
            0 6px 12px rgba(0,0,0,0.18),
            0 12px 24px rgba(0,0,0,0.18),
            inset 0 1px 0 rgba(255,255,255,0.25)
          `,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:active": {
          boxShadow: `
              0 3px 6px rgba(0,0,0,0.25),
              inset 0 3px 6px rgba(0,0,0,0.25)
            `,
        },
      }}
    >
      <AddIcon />
    </IconButton>
  )
}

export default AddDataButton
