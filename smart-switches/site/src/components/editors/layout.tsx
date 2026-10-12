import React from 'react';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { Button, IconButton, MenuItem, Select, Stack, Switch, Typography } from '@mui/material';
import ColorPicker from '../inputs/color-picker';
import ExecutablePicker from '../inputs/executable-picker';
import { DefaultApi, Config } from '../../api';
import { ButtonsByLayout } from '../../api/convenience';


const styles: { [key: string]: React.CSSProperties } = {
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 2,
    margin: 0,
    padding: 0,
  },
  editorRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
}

export type LayoutEditorProps = {
    api: DefaultApi,
    config?: Config,
    currentSwitch?: string,
    currentLayout?: string,
    onUpdate: (latestConfig: Config) => Promise<void>,
}

const LayoutEditor: React.FC<LayoutEditorProps> = props => {
    if (!props.config || !props.currentSwitch || !props.currentLayout) {
        return <div style={styles.flexRow} />
    }

    const currentSwitch = props.config.switches[props.currentSwitch]
    const currentLayout = currentSwitch.layouts[props.currentLayout];

    if (currentSwitch == undefined || currentLayout == undefined) {
        return <div style={styles.flexRow} />
    }

    const onUpdate = async () => {
      if (!props.currentLayout) return

      currentSwitch.layouts[props.currentLayout] = currentLayout

      return props.onUpdate({
        switches: {
          ...(props.config?.switches ?? {}),
          [props.currentSwitch as string]: currentSwitch,
        }
      })
    }

    const canFlip = ButtonsByLayout[props.currentLayout].includes('flipped');

    const basicButtons = ButtonsByLayout[props.currentLayout]
      .filter(button => button != 'flipped')
      .sort((a, b): number => {
        // Handle the equal condition right away
        if (a == b) {
          return 0
        }

        let intA = parseInt(a)
        let aIsInt = !Number.isNaN(intA)

        let intB = parseInt(b)
        let bIsInt = !Number.isNaN(intB)

        // Remember, at this point elements will not be equal
        if (bIsInt && aIsInt) {
          return intA < intB ? -1 : 1
        } else if (aIsInt) {
          return 1
        } else if (bIsInt) {
          return -1
        } else {
          return a < b ? -1 : 1
        }
      })

    const row = (key: string, title: string, accessory: React.ReactNode) => (
      <div key={key} style={styles.editorRow}>
        {title}
        <div style={{ display: 'flex', height: 0, flexGrow: 2, }} />
        {accessory}
      </div>
    )

    return (
        <div style={styles.flexRow}>
          <div style={styles.flexRow} />
          <div style={{ display: 'flex', flexDirection: 'column', width: 400 }}>
            {canFlip
              ? <>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{ textTransform: 'uppercase', pl: 1.5, pt: 1.5 }}
                >Layout</Typography>
              {
                row('flipped', 'Flipped?', <Switch
                  checked={canFlip ? !!(currentLayout as { flipped?: boolean }).flipped : false}
                  onChange={(_, checked) => {
                    if (canFlip) {
                      (currentLayout as { flipped?: boolean }).flipped = checked
                      return onUpdate()
                    }
                  }} 
                />
              )}</>
              : <></>
            }
            <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{ textTransform: 'uppercase', pl: 1.5, pt: 1.5 }}
                >Basic Buttons</Typography>
            {
              basicButtons
                .map(buttonName => {
                  const command = currentLayout.buttons[buttonName]
                  if (!command) return <></>

                  const r = Math.round(command.color?.[0] ?? 50)
                  const g = Math.round(command.color?.[1] ?? 100)
                  const b = Math.round(command.color?.[2] ?? 255)

                  return row(buttonName, buttonName, <Stack direction='row' spacing={1} alignItems='center'>
                    <ColorPicker
                      value={{ r, g, b }}
                      onChange={({ r, g, b }) => {
                        command.color = [r, g, b]
                        currentLayout.buttons[buttonName] = command

                        return onUpdate()
                      }}
                    />
                    <ExecutablePicker
                        value={currentLayout.buttons[buttonName]?.cmd}
                        api={props.api}
                        onPick={async picked => {
                          let currentButton = currentLayout.buttons[buttonName]

                          if (currentButton && picked) {
                            currentButton.cmd = picked.entityId
                            currentLayout.buttons[buttonName] = currentButton
                          }

                          return onUpdate()
                        }}
                      />
                      <IconButton
                        size="small"
                        disabled={!currentLayout.buttons[buttonName]}
                        onClick={() => {
                          props.api
                            .press({
                              _switch: props.currentSwitch as string,
                              layout: props.currentLayout as string,
                              key: buttonName,
                            })
                            .catch(err => {
                              console.error(err)
                            })
                        }}
                      >
                        <PlayArrow />
                      </IconButton>
                    </Stack>,
                  )
                })
            }
            {
              (() => {
                const longPressButtons = basicButtons.filter(btn => currentLayout.buttons[`${btn}-long`])

                if (longPressButtons.length === 0) return <></>

                return <>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{ textTransform: 'uppercase', pl: 1.5, pt: 1.5 }}
                >Long Press</Typography>
                  {
                    longPressButtons.map(buttonName => {
                      const longPressKey = `${buttonName}-long`
                      const command = currentLayout.buttons[longPressKey]
                      if (!command) return <></>

                      const r = Math.round(command.color?.[0] ?? 50)
                      const g = Math.round(command.color?.[1] ?? 100)
                      const b = Math.round(command.color?.[2] ?? 255)

                      return row(longPressKey, buttonName, <Stack direction='row' spacing={1} alignItems='center'>
                        <ColorPicker
                          value={{ r, g, b }}
                          onChange={({ r, g, b }) => {
                            command.color = [r, g, b]
                            currentLayout.buttons[longPressKey] = command

                            return onUpdate()
                          }}
                        />
                        <ExecutablePicker
                            value={currentLayout.buttons[longPressKey]?.cmd}
                            api={props.api}
                            onPick={async picked => {
                              let currentButton = currentLayout.buttons[longPressKey]

                              if (currentButton && picked) {
                                currentButton.cmd = picked.entityId
                                currentLayout.buttons[longPressKey] = currentButton
                              }

                              return onUpdate()
                            }}
                          />
                          <IconButton
                            size="small"
                            disabled={!currentLayout.buttons[longPressKey]}
                            onClick={() => {
                              props.api
                                .press({
                                  _switch: props.currentSwitch as string,
                                  layout: props.currentLayout as string,
                                  key: longPressKey,
                                })
                                .catch(err => {
                                  console.error(err)
                                })
                            }}
                        >
                            <PlayArrow />
                          </IconButton>
                          <Button
                            color="error"
                            size="small"
                            onClick={() => {
                              delete currentLayout.buttons[longPressKey]
                              return onUpdate()
                            }}
                        >
                            Remove
                          </Button>
                        </Stack>,
                      )
                    })
                  }
                </>
              })()
            }
            {
              // Add button / configure long press dropdowns
              (() => {
                const unconfiguredButtons = basicButtons.filter(btn => !currentLayout.buttons[btn])
                const longPressableButtons = basicButtons.filter(btn => (
                  currentLayout.buttons[btn] && !currentLayout.buttons[`${btn}-long`]
                ))

                if (unconfiguredButtons.length === 0 && longPressableButtons.length === 0) {
                  return <></>
                }

                return (
                  <div style={{ ...styles.editorRow, justifyContent: 'flex-start' }}>
                    <Stack direction='row' spacing={1} alignItems='center'>
                      {unconfiguredButtons.length > 0 && (
                        <Select
                          size="small"
                          displayEmpty
                          sx={{ width: 150 }}
                          value=""
                          renderValue={() => <Typography color="text.secondary">Add button</Typography>}
                          onChange={async (event) => {
                            const value = event.target.value
                            if (value) {
                              // Initialize the button with default values
                              currentLayout.buttons[value] = {
                                cmd: '',
                                color: [0, 0, 255]
                              }
                              await onUpdate()
                            }
                          }}
                        >
                          {unconfiguredButtons.map(btn => (
                            <MenuItem key={btn} value={btn}>{btn}</MenuItem>
                          ))}
                        </Select>
                      )}
                      {longPressableButtons.length > 0 && (
                        <Select
                          size="small"
                          displayEmpty
                          sx={{ width: 190 }}
                          value=""
                          renderValue={() => <Typography color="text.secondary">Configure long press</Typography>}
                          onChange={async (event) => {
                            const value = event.target.value
                            if (value) {
                              // Initialize the long press command with default values
                              currentLayout.buttons[`${value}-long`] = {
                                cmd: '',
                                color: [0, 0, 255]
                              }
                              await onUpdate()
                            }
                          }}
                        >
                          {longPressableButtons.map(btn => (
                            <MenuItem key={btn} value={btn}>{btn}</MenuItem>
                          ))}
                        </Select>
                      )}
                    </Stack>
                  </div>
                )
              })()
            }
            <div style={{ display: 'flex', flexGrow: 2, }}/>
          </div>
        </div>
    )
}

export default LayoutEditor;
