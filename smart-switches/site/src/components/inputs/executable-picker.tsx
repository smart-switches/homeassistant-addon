import * as React from "react"
import { ListExecutablesResponseBody, Executable, DefaultApi } from "../../api"
import { Autocomplete, Stack, TextField, Typography } from "@mui/material"
import { monospace } from "../../styles"
import useForceRefresh from "../../hooks/useForceRefresh"

export type ExecuablePickerProps = {
    api: DefaultApi,
    value?: string
    onPick?: (executable: Executable | undefined) => Promise<void>
}

const ExecutablePicker: React.FC<ExecuablePickerProps> = (props) => {
    let [executables, setExecutables] = React.useState<ListExecutablesResponseBody['executables'] | undefined>(undefined)
    let [fetchingExecutables, setFetchingExecutables] = React.useState(false)
    let forceRefresh = useForceRefresh()
    
    React.useEffect(() => {
        if (fetchingExecutables) {
            return () => {}
        }


        setFetchingExecutables(true)

        props.api
            .listExecutables()
            .then(response => {
                setExecutables(response.executables)
                forceRefresh()
            })

        return () => {
        }
    }, [fetchingExecutables, setFetchingExecutables, executables, setExecutables])

    const ids = Object.keys(executables ?? {})

    return (
        <Autocomplete
            size="small"
            sx={{ width: 220 }}
            options={ids}
            value={props.value && ids.includes(props.value) ? props.value : null}
            slotProps={{
                popper: {
                    style: { width: 'fit-content' },
                    placement: 'bottom-start',
                },
            }}
            getOptionLabel={entityId => (executables ?? {})[entityId]?.friendlyName ?? entityId}
            filterOptions={(options, state) => {
                const query = state.inputValue.toLowerCase()

                return options.filter(entityId => (
                    entityId.toLowerCase().includes(query) ||
                    ((executables ?? {})[entityId]?.friendlyName ?? '').toLowerCase().includes(query)
                ))
            }}
            onChange={(_, value) => {
                console.log('executable picker changed to:', value)

                if (props.onPick && executables) {
                    props.onPick(value ? executables[value] : undefined)
                }
            }}
            renderInput={params => <TextField {...params} placeholder="none" />}
            renderOption={(optionProps, entityId) => (
                <li {...optionProps} key={entityId}>
                    <Stack>
                        <Typography variant="caption" color="text.secondary" fontStyle="italic" style={monospace}>
                            {entityId}
                        </Typography>
                        <Typography variant="body2">
                            {(executables ?? {})[entityId]?.friendlyName}
                        </Typography>
                    </Stack>
                </li>
            )}
        />
    )
}

export default ExecutablePicker
