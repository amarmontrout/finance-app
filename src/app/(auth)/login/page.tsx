import { Box } from "@mui/material"
import LoginForm from "./LoginForm"

const Page = () => {
  return (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <LoginForm />
    </Box>
  )
}

export default Page
