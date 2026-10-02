import { Checkbox } from "@mui/material"

const CheckboxInput = ({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (value: boolean) => void
}) => {
  return (
    <Checkbox
      disableRipple
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      sx={{
        p: 0,
        color: "#A97C2F",
        "&.Mui-checked": {
          color: "#A97C2F",
        },
      }}
    />
  )
}

export default CheckboxInput
