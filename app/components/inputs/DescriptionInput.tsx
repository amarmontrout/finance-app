import { TextField } from "@mui/material"

const DescriptionInput = ({
  value,
  onChange,
  autoFocus,
  onBlur,
}: {
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
  onBlur: () => void
}) => {
  return (
    <TextField
      id={"description"}
      variant={"standard"}
      size={"small"}
      value={value}
      autoFocus={autoFocus}
      onBlur={onBlur}
      onChange={(e) => onChange(e.target.value)}
      multiline
      minRows={1}
      sx={{
        width: "100%",
        "& .MuiInputBase-root": {
          minHeight: 36,
        },
        "& textarea": {
          fontSize: "16px",
        },
      }}
      placeholder={"Add a Description"}
    />
  )
}

export default DescriptionInput
