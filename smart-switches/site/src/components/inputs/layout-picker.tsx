import * as React from "react"
import { Switch } from "../../api"
import { LayoutInstance } from "../../api/models/LayoutInstance"
import { Button, Menu, MenuItem, Stack, Typography } from "@mui/material"
import { LayoutNames, LayoutDescriptions } from "../../api/convenience"

export type LayoutPickerProps = {
    switch?: Switch,
    onPick: (key: string, layout: LayoutInstance) => Promise<void>
}

const LayoutPicker: React.FC<LayoutPickerProps> = (props) => {
    const sw = props.switch ?? { layouts: {} }

    const pickLayout = (layout: string) => {
        console.log(layout)

        if (!layout) {
            return
        }

        const newLayout: LayoutInstance = {
            version: layout,
            buttons: {},
            flipped: false,
        }

        props.onPick(layout, newLayout)
    }

    const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)

    return (
        <>
            <Button
                variant="outlined"
                onClick={event => setAnchor(event.currentTarget)}
            >
                Add layout
            </Button>
            <Menu
                anchorEl={anchor}
                open={!!anchor}
                onClose={() => setAnchor(null)}
            >
                {LayoutNames.map(layout => (
                    <MenuItem
                        key={layout}
                        disabled={!!sw.layouts[layout]}
                        onClick={() => {
                            setAnchor(null)
                            pickLayout(layout)
                        }}
                    >
                        <Stack spacing={0.5} sx={{ maxWidth: 200, whiteSpace: 'normal' }}>
                            <Typography variant="body2" fontWeight="bold">
                                {layout}
                            </Typography>
                            <Typography variant="body2">
                                {LayoutDescriptions[layout] || "No description"}
                            </Typography>
                        </Stack>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default LayoutPicker
