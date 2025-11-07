# Home Assistant Add-on

Web UI for configuring smart switches. **Go backend** + **React frontend**.

## Architecture

- **Backend**: [smart-switches/server/](smart-switches/server/) - Go server (port 8124) with Huma v2 + OpenAPI
  - Receives button press events from firmware at `/api/press`
  - Executes HA scripts/scenes via Supervisor API
  - Config stored in `/data/switches_v2.json`

- **Frontend**: [smart-switches/site/](smart-switches/site/) - Gatsby + Ant Design
  - TypeScript client auto-generated from OpenAPI spec
  - Dev server: port 7128, production: port 8124

## Key Files

- [smart-switches/config.yml](smart-switches/config.yml) - HA add-on manifest
- [smart-switches/server/api/press.go](smart-switches/server/api/press.go) - Button press handler
- [smart-switches/server/homeassistant/api.go](smart-switches/server/homeassistant/api.go) - HA Supervisor integration
- [smart-switches/site/src/pages/index.tsx](smart-switches/site/src/pages/index.tsx) - Main UI

## Development

```bash
make -C smart-switches tidy-server        # Tidy Go modules (run after go.mod changes!)
make -C smart-switches build-server       # Build Go backend
make -C smart-switches run-server         # Run backend (port 8124)
make -C smart-switches generate-server-sdk # Regenerate TypeScript client
make -C smart-switches run-site           # Run frontend dev server (port 7128)
```

**Important**: Always run `make tidy-server` after changing Go dependencies before committing.
