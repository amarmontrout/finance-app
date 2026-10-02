"use client"

import { createTheme } from "@mui/material/styles"
import { BACKGROUND, SURFACE, TEXT_COLOR } from "./data/colors"

export const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#90caf9",
    },

    background: {
      default: BACKGROUND,
      paper: SURFACE,
    },

    text: {
      primary: TEXT_COLOR,
      secondary: TEXT_COLOR,
    },

    divider: "rgba(255, 255, 255, 0.12)",
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
})
