import * as React from "react"
import { Box, ButtonBase, Popover } from "@mui/material"
import { RgbColorPicker } from "react-colorful"

export type Rgb = { r: number, g: number, b: number }

export type ColorPickerProps = {
  value: Rgb,
  onChange: (color: Rgb) => void,
}

const ColorPicker: React.FC<ColorPickerProps> = props => {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)
  const [draft, setDraft] = React.useState<Rgb>(props.value)

  const { r, g, b } = props.value

  // Keep the draft in sync with the stored value while the popover is closed
  React.useEffect(() => {
    if (!anchor) {
      setDraft({ r, g, b })
    }
  }, [r, g, b, anchor])

  return (
    <>
      <ButtonBase
        aria-label="Pick color"
        onClick={event => setAnchor(event.currentTarget)}
        sx={{
          width: 32,
          height: 32,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: `rgb(${r},${g},${b})`,
        }}
      />
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => {
          setAnchor(null)

          // Persist once on close rather than on every drag event
          if (draft.r !== r || draft.g !== g || draft.b !== b) {
            props.onChange(draft)
          }
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 1.5 }}>
          <RgbColorPicker color={draft} onChange={setDraft} />
        </Box>
      </Popover>
    </>
  )
}

export default ColorPicker
