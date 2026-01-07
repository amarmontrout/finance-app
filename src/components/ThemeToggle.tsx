"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Box } from "@mui/material";

const ThemeToggle = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const current = theme === "system" ? systemTheme : theme;
  const isDark = current === "dark";

  return (
    <Box
      component="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      sx={{
        position: "relative",
        width: 100,
        height: 45,
        borderRadius: "9999px",
        border: 1,
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1.5,
        cursor: "pointer",
        bgcolor: "background.paper",
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      {/* Sun icon on left */}
      <LightModeIcon
        sx={{
          color: isDark ? "text.disabled" : "primary.main",
          transition: "color 0.3s",
        }}
      />

      {/* Moon icon on right */}
      <DarkModeIcon
        sx={{
          color: isDark ? "primary.main" : "text.disabled",
          transition: "color 0.3s",
        }}
      />

      {/* Slider Circle */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: isDark ? "calc(100% - 40px)" : "5px",
          transform: "translateY(-50%)",
          width: 35,
          height: 35,
          borderRadius: "50%",
          bgcolor: "background.default",
          boxShadow: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "left 0.3s, bgcolor 0.3s",
        }}
      >
        {isDark ? <DarkModeIcon /> : <LightModeIcon />}
      </Box>
    </Box>
  );
};

export default ThemeToggle;
