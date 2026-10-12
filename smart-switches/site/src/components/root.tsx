import * as React from "react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import theme from "../theme"
import { SnackbarProvider } from "./snackbar"

const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <SnackbarProvider>
      {children}
    </SnackbarProvider>
  </ThemeProvider>
)

export default Root
