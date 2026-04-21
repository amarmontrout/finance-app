import { createTheme } from "@mui/material";
import { 
  lightMode, 
  darkMode, 
} from "@/globals/colors";

export const lightTheme = createTheme({
  palette: {
    mode: "light",

    // Backgrounds
    background: {
      default: lightMode.baseBg,
      paper: lightMode.surfaceBg,
    },

    // Text
    text: {
      primary: lightMode.primaryText,
      secondary: lightMode.secondaryText,
      disabled: lightMode.disabledText,
    },

    // Dividers & Borders
    divider: lightMode.borderMuted,
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: lightMode.surfaceBg,
          borderColor: lightMode.borderStrong,
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",

    background: {
      default: darkMode.baseBg,
      paper: darkMode.surfaceBg,
    },

    text: {
      primary: darkMode.primaryText,
      secondary: darkMode.secondaryText,
      disabled: darkMode.disabledText,
    },

    divider: darkMode.borderMuted,
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: darkMode.surfaceBg,
          borderColor: darkMode.borderStrong,
        },
      },
    },
  },
});
