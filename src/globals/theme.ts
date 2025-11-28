import { createTheme } from "@mui/material";
import { lightMode, darkMode, accentColorPrimary, accentColorSecondary } from "@/globals/colors";

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

    // Buttons, main UI color
    primary: {
      main: accentColorPrimary,
    },

    secondary: {
      main: accentColorSecondary,
    },

    success: {
      main: lightMode.success,
    },

    warning: {
      main: lightMode.warning,
    },

    error: {
      main: lightMode.error,
    },
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

    primary: {
      main: accentColorPrimary,
    },

    secondary: {
      main: accentColorSecondary,
    },

    success: {
      main: darkMode.success,
    },

    warning: {
      main: darkMode.warning,
    },

    error: {
      main: darkMode.error,
    },
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
