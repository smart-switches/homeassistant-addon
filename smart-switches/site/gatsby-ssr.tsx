import * as React from "react"
import type { GatsbySSR } from "gatsby"
import Root from "./src/components/root"

export const wrapRootElement: GatsbySSR["wrapRootElement"] = ({ element }) => (
  <Root>{element}</Root>
)
