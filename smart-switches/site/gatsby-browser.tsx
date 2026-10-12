import * as React from "react"
import type { GatsbyBrowser } from "gatsby"
import Root from "./src/components/root"

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({ element }) => (
  <Root>{element}</Root>
)
