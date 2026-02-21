import { 
  Box, 
  IconButton, 
  ListItemIcon, 
  ListItemText, 
  Menu, 
  MenuItem 
} from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings';
import React from "react"
import { doLogout } from "@/app/api/Auth/requests"
import { AuthError } from "@supabase/supabase-js"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"

const HeaderDropdown = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme, systemTheme } = useTheme()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const current = theme === "system" ? systemTheme : theme

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleTheme = () => {
    setTheme(current === "dark" ? "light" : "dark")
    handleCloseMenu()
  }

  const handleSettings = () => {
    router.push("/settings")
    handleCloseMenu()
  }

  const handleLogOut = () => {
    doLogout({
      router: router,
      errorHandler: (error: AuthError) => {
        console.error(error.message)
      }
    })
    handleCloseMenu()
  }

  return (
    <Box
      alignContent={"center"}
      marginLeft={"5px"}
      marginRight={"1.5rem"}
      height={"100%"}
    >
      <IconButton
        onClick={handleOpenMenu}
      >
        <MenuIcon fontSize={"large"} sx={{color: "white"}}/>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleTheme}>
          <ListItemIcon>
            {current !== "dark" ? <DarkModeIcon /> : <LightModeIcon />}
          </ListItemIcon>

          <ListItemText>
            {current !== "dark" ? "Dark Mode" : "Light Mode"}
          </ListItemText>
        </MenuItem>

        {pathname !== "/login" && 
          <MenuItem onClick={handleSettings}>
            <ListItemIcon>
              <SettingsIcon/>
            </ListItemIcon>

            <ListItemText>
              Settings
            </ListItemText>
          </MenuItem>
        }

        {pathname !== "/login" && 
          <MenuItem onClick={handleLogOut}>
            <ListItemIcon>
              <LogoutIcon/>
            </ListItemIcon>

            <ListItemText>
              Logout
            </ListItemText>
          </MenuItem>
        }
      </Menu>
    </Box>
  )
}

export default HeaderDropdown