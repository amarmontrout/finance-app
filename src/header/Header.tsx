"use client"

import ThemeToggle from "@/components/ThemeToggle";
import { accentColorSecondary } from "@/globals/colors";
import { useUser } from "@/hooks/useUser";
import { supabaseBrowser } from "@/utils/supabase/client";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const Header = () => {
  const supabase = supabaseBrowser()
  const router = useRouter()
  const user = useUser()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <Stack
      direction={"row"}
      height={"100%"}
      justifyContent={"space-between"}
    >
      <Box
        minWidth={"fit-content"}
        alignContent={"center"}
        marginLeft={"1.5rem"}
        marginRight={"5px"}
      >
        <Typography
          variant="h5" 
          color={"white"}
        >
          Finance Tracker
        </Typography>
      </Box>

      <Stack
        direction={"row"}
        gap={2}
        alignItems={"center"}
        marginLeft={"5px"}
        marginRight={"1.5rem"}
      >
        {
          user &&
          <Button
            variant={"contained"}
            size={"small"}
            onClick={logout}
            sx={{
              backgroundColor: accentColorSecondary
            }}
          >
            Log Out
          </Button>
        }

        <ThemeToggle />
      </Stack>
    </Stack>
  )
}

export default Header