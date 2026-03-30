import { positiveColor } from "@/globals/colors"
import {
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  Button,
} from "@mui/material"
import { ChangeEvent } from "react"

const SimpleForm = ({
  label,
  value,
  onChange,
  onSubmit,
  isLoading,
  isDisabled,
}: {
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: () => void
  isLoading: boolean
  isDisabled?: boolean
}) => {
  return (
    <Box className="flex flex-col gap-2 mt-1 mb-3">
      <FormControl>
        <InputLabel>{label}</InputLabel>
        <OutlinedInput label={label} value={value} onChange={onChange} />
      </FormControl>

      <Button
        variant={"contained"}
        onClick={onSubmit}
        sx={{
          backgroundColor: positiveColor,
        }}
        disabled={isDisabled || value === ""}
        loading={isLoading}
      >
        {`Add`}
      </Button>
    </Box>
  )
}

export default SimpleForm
