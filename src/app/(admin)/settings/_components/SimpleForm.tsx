import { positiveColor } from "@/global/colors"
import { Box, Button, OutlinedInput } from "@mui/material"
import { ChangeEvent } from "react"

const SimpleForm = ({
  placeholder,
  value,
  onChange,
  onSubmit,
  isLoading,
  isDisabled,
}: {
  placeholder: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: () => void
  isLoading: boolean
  isDisabled?: boolean
}) => {
  return (
    <Box className="mb-3 mt-1 flex flex-col gap-2">
      <OutlinedInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        size={"small"}
      />

      <Button
        variant={"contained"}
        onClick={onSubmit}
        sx={{
          backgroundColor: positiveColor.color,
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
