import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"

import NewSwitchModal from "../components/modals/new-switch";
import LayoutPicker from "../components/inputs/layout-picker";
import {
  AppBar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModal from "../components/modals/confirm";
import LayoutEditor from "../components/editors/layout";
import { Config, createConfiguration, DefaultApi, ListExecutablesResponseBody, server1 } from "../api";
import { fetchLayoutDefinitions } from "../api/convenience";

// Theme tokens, which resolve to the light or dark value based on the active color scheme
const borderColor = 'var(--mui-palette-divider)';
const backgroundColor = 'var(--mui-palette-background-paper)';

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
  },
  header: {
    paddingLeft: 12,
    paddingRight: 12,
    background: backgroundColor,
    fontWeight: 'bold',
  },
  content: {
    borderTop: `solid 1px ${borderColor}`,
    display: 'flex',
    color: "var(--mui-palette-text-primary)",
    flexDirection: 'row',
    flexGrow: 2,
    margin: 0,
    padding: 0,
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    width: '20%',
    minWidth: 250,
    maxWidth: 500,
    height: '100%',
    background: backgroundColor,
    borderRight: `solid 1px ${borderColor}`,
  },
  sidebarItem: {
    display: 'flex',
    width: '100%',
    padding: 12,
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: `solid 1px ${borderColor}`,
    borderRadius: 0,
    background: backgroundColor,
    color: 'inherit',
  },
}

/*
  * Rooms
    * Switches
      *  Configuration

  Sidebar for rooms and switches
  Main window for configuration?
 */

const IndexPage: React.FC<PageProps> = () => {
  let [refresh, setRefresh] = React.useState(false)
  let [loading, setLoading] = React.useState(false)

  let [executables, setExecutables] = React.useState({} as ListExecutablesResponseBody['executables'])
  let [fetchingExecutables, setFetchingExecutables] = React.useState(false)

  let [config, setConfig] = React.useState<Config | undefined>(undefined)
  let [currentSwitch, setCurrentSwitch] = React.useState<string | undefined>(undefined)
  let [currentLayout, setCurrentLayout] = React.useState<string | undefined>(undefined)

  const deleteSwitch = async (name: string) => {
    if (config?.switches) {
      delete config.switches[name]

      try {
        await api.putConfig(config)
        setConfig(config)
        forceRefresh()
      } catch(e) {
        console.error(e)
      }
    }
  }

  const deleteLayout = async (name: string) => {
    if (config?.switches && currentSwitch && sw) {
      const updatedLayouts = { ...sw.layouts }
      delete updatedLayouts[name]

      let newConfig = {
        switches: {
          ...(config?.switches ?? {}),
          [currentSwitch as string]: {
            layouts: updatedLayouts
          }
        }
      }

      try {
        await api.putConfig(newConfig)
        setConfig(newConfig)
        forceRefresh()
      } catch(e) {
        console.error(e)
      }
    }
  }

  const forceRefresh = () => setRefresh(!refresh)

  let [showNewSwitch, setShowNewSwitch] = React.useState(false)

  const api = new DefaultApi(createConfiguration({}))

  let sw = currentSwitch ? config?.switches[currentSwitch] : undefined

  React.useEffect(() => {
    if (loading) {
      return () => {}
    }

    let ignore = false
    setLoading(true)

    // Fetch layout definitions first
    fetchLayoutDefinitions().then(() => {
      api
        .getConfig()
        .then(response => {
          if (!response.switches) {
            response.switches = {}
          }

          setConfig(response)

          if (response.switches?.length) {
            setCurrentSwitch(Object.keys(response.switches)[0])

            if (Object.keys(response.switches[0].layouts).length > 0) {
              setCurrentLayout(Object.keys(response.switches[0].layouts)[0])
            }
          }
        })
    })

    return () => {
      ignore = true
    }
  }, [loading, setLoading, config, setConfig])

  React.useEffect(() => {
    if (fetchingExecutables) {
      return () => {}
    }

    let ignore = false
    setFetchingExecutables(true)

    api
      .listExecutables()
      .then(response => {
        setExecutables(response.executables ?? {})
      })

    return () => {
      ignore = true
    }
  }, [fetchingExecutables, setFetchingExecutables, executables, setExecutables])

  const [showConfirmDeleteSwitch, setShowConfirmDeleteSwitch] = React.useState(false)
  const confirmDeleteSwitchModal = (<ConfirmModal
    title={"Confirm deletion"}
    body={<>
      {`Are you sure you want to delete ${currentSwitch}?`}
      <br/>
      {`This cannot be undone.`}
    </>}
    open={showConfirmDeleteSwitch}
    okText="Delete"
    okColor="error"
    onOk={() => deleteSwitch(currentSwitch as string)}
    onCancel={() => {
      setShowConfirmDeleteSwitch(false)
    }}
  />)

  const [showConfirmDeleteLayout, setShowConfirmDeleteLayout] = React.useState(false)
  const confirmDeleteLayoutModal = (<ConfirmModal
    title={"Confirm deletion"}
    body={<>
      {`Are you sure you want to delete ${currentLayout} of ${currentSwitch}?`}
      <br/>
      {`This cannot be undone.`}
    </>}
    open={showConfirmDeleteLayout}
    okText="Delete"
    okColor="error"
    onOk={() => deleteLayout(currentLayout as string)}
    onCancel={() => {
      setShowConfirmDeleteLayout(false)
    }}
  />)

  const switchesMenu = (
    <List disablePadding style={styles.sidebar}>
      {Object.keys(config?.switches ?? {}).length
        ? Object.keys(config?.switches ?? {}).map((name: string) => (
          <ListItem
            key={name}
            disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                color="error"
                aria-label={`Delete ${name}`}
                onClick={() => {
                  setCurrentSwitch(name)
                  setShowConfirmDeleteSwitch(true)
                }}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemButton
              selected={name === currentSwitch}
              onClick={() => {
                setCurrentSwitch(name)
                setCurrentLayout(Object.keys(config?.switches[name].layouts ?? {})[0])
              }}
            >
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        ))
        : (
          <ListItem>
            <ListItemText secondary="Add a switch to get started" />
          </ListItem>
        )}
      <ListItem>
        <Button
          variant="outlined"
          onClick={() => {
            setShowNewSwitch(true)
          }}
        >Add switch</Button>
      </ListItem>
    </List>
  )

  const layoutsMenu = (
    <List disablePadding style={styles.sidebar}>
      {sw && (
        <>
          {Object.keys(sw.layouts).length
            ? Object.keys(sw.layouts).map((name: string) => (
              <ListItem
                key={name}
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    color="error"
                    aria-label={`Delete ${name}`}
                    onClick={() => {
                      setCurrentLayout(name)
                      setShowConfirmDeleteLayout(true)
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={name === currentLayout}
                  onClick={() => {
                    console.log(`Selecting ${name}`, sw?.layouts[name])
                    setCurrentLayout(name)
                  }}
                >
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            ))
            : (
              <ListItem>
                <ListItemText secondary="Add a layout set up commands" />
              </ListItem>
            )}
          <ListItem>
            <LayoutPicker
              switch={sw}
              onPick={async (key, layout) => {
                if (!sw) return

                sw.layouts[key] = layout
                if (!!config?.switches && !!currentSwitch) {
                  config.switches[currentSwitch] = sw
                  await api.putConfig(config)
                  setCurrentLayout(key)
                }
              }}
            />
          </ListItem>
        </>
      )}
    </List>
  )

  return (
    <main style={styles.page}>
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar variant="dense" style={styles.header}>
          <Typography variant="h6" component="h1" fontWeight="bold">Smart Switches</Typography>
        </Toolbar>
      </AppBar>
      <div style={styles.content}>
        {switchesMenu}
        {layoutsMenu}
        <LayoutEditor
          api={api}
          config={config}
          currentSwitch={currentSwitch}
          currentLayout={currentLayout}
          onUpdate={async (latestConfig) => {
            console.log('Updating config:', latestConfig)

            try {
              await api.putConfig(latestConfig)
              setConfig(latestConfig)
              forceRefresh()
            } catch (err) {
              console.error(err)
            }
          }}        
        />
      </div>
      {confirmDeleteSwitchModal}
      {confirmDeleteLayoutModal}
      <NewSwitchModal 
        show={showNewSwitch}
        onHide={() => {
          setShowNewSwitch(false)
        }}
        onConfirm={async remoteName => {
          if (!config) {
            config = {
              switches: {}
            }
          }

          if (!config.switches) {
            config = {
              switches: {}
            }
          }

          if (config.switches[remoteName]) {
            throw new Error('Cannot add remote')
          }
          
          config.switches[remoteName] = {
            layouts: {},
          }

          const res = await api.putConfig(config)
          setConfig(res)

          return res
        }}
      />
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Smart Switches</title>
