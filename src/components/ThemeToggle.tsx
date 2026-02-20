"use client";

import { useTheme } from "next-themes";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Box } from "@mui/material";

const ThemeToggle = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  
  const current = theme === "system" ? systemTheme : theme;
  const isDark = current === "dark";

  return (
    <Box
      component="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      sx={{
        borderRadius: "50%",
        padding: 1.5,
        display: "flex",
        cursor: "pointer",
        bgcolor: "background.paper",
        transition: "background 0.4s",
      }}
    >
      {isDark ? <DarkModeIcon /> : <LightModeIcon />}
    </Box>
  );
};

export default ThemeToggle;
