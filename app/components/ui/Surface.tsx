import { Paper, styled } from "@mui/material"

const Surface = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  backgroundImage: "none",
}))

export default Surface
