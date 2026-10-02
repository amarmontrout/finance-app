import { Box, Stack, Typography } from "@mui/material"

const FormRow = ({
  active,
  label,
  display,
  edit,
  onClick,
}: {
  active?: boolean
  label: string
  display: React.ReactNode
  edit?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}) => {
  return (
    <Stack
      direction={"row"}
      sx={{
        minHeight: "36px",
        justifyContent: "space-between",
        alignItems: "stretch",
      }}
    >
      <Typography
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "center",
        }}
      >
        {label}
      </Typography>
      <Box
        onClick={onClick}
        sx={{
          minWidth: 0,
          flex: 1.5,
          textAlign: "right",
          alignContent: "center",
        }}
      >
        {active ? edit : display}
      </Box>
    </Stack>
  )
}
export default FormRow
