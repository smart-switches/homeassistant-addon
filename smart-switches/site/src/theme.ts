import { createTheme } from "@mui/material/styles"

// Prefer the platform's native UI font, falling back to common sans-serif fonts
const systemFontStack = [
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
].join(",")

const theme = createTheme({
  // Expose the palette as --mui-* CSS variables, and pick the light/dark scheme
  // from the OS-level prefers-color-scheme media query (no JS, so no flash on load)
  cssVariables: {
    colorSchemeSelector: "media",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#1677ff",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#4096ff",
        },
      },
    },
  },
  typography: {
    fontFamily: systemFontStack,
  },
})

export default theme
