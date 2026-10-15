import { createConfiguration, DefaultApi, ServerConfiguration } from "./api"

// The generated client prepends window.location.origin to any base URL that isn't
// absolute, so a relative base like "." produces invalid URLs. Resolve the page's
// own directory to an absolute URL instead, which works both on the direct port
// (http://host:8124) and under the Home Assistant ingress prefix
// (https://host/api/hassio_ingress/<token>).
export function apiBaseUrl(): string {
  if (typeof window === "undefined") {
    // Gatsby server-side rendering; no requests are made during the build
    return ""
  }

  return new URL(".", window.location.href).toString().replace(/\/$/, "")
}

export function createApi(): DefaultApi {
  return new DefaultApi(
    createConfiguration({ baseServer: new ServerConfiguration(apiBaseUrl(), {}) })
  )
}
