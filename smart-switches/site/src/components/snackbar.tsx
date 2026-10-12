import * as React from "react"
import { Alert, Snackbar } from "@mui/material"

type Severity = "error" | "success" | "info" | "warning"

type SnackbarContextValue = {
  show: (message: string, severity?: Severity) => void,
}

const SnackbarContext = React.createContext<SnackbarContextValue>({
  show: () => {},
})

export const useSnackbar = () => React.useContext(SnackbarContext)

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [severity, setSeverity] = React.useState<Severity>("info")

  const show = React.useCallback((text: string, level: Severity = "info") => {
    setMessage(text)
    setSeverity(level)
    setOpen(true)
  }, [])

  const value = React.useMemo(() => ({ show }), [show])

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={severity} onClose={() => setOpen(false)} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
