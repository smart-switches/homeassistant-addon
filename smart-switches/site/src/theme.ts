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
  palette: {
    primary: {
      main: '#1677ff',
    },
  },
  typography: {
    fontFamily: systemFontStack,
  },
})

export default theme
