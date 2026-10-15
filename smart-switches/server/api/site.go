package api

import (
	"bytes"
	"io"
	"maps"
	"mime"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/gabriel-vasile/mimetype"
)

const (
	siteFolder = "/smartswitches/site/public"
	apiPrefix  = "/api"

	// The site is built with this as its path prefix (gatsby --prefix-paths).
	// It is swapped for the real prefix when files are served: the Home Assistant
	// ingress path (sent in ingressPathHeader), or nothing for direct access.
	sitePrefixPlaceholder = "/__INGRESS_PREFIX__"
	ingressPathHeader     = "X-Ingress-Path"
)

var validIngressPath = regexp.MustCompile(`^/[A-Za-z0-9/_.\-]*$`)

// Files in which the prefix placeholder may appear
var rewritableExtensions = map[string]bool{
	".html": true,
	".js":   true,
	".json": true,
	".css":  true,
}

func SiteMiddleware(local bool) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if strings.HasPrefix(r.URL.Path, apiPrefix) {
				next.ServeHTTP(w, r)
				return
			}

			subpath := r.URL.Path
			if subpath == "" || subpath == "/" {
				subpath = "/index.html"
			}

			if local {
				localSite := "http://host.docker.internal:7128"

				proxyRequest, err := http.NewRequest(
					r.Method,
					localSite+subpath,
					r.Body,
				)

				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte(err.Error()))
					return
				}

				res, err := http.DefaultClient.Do(proxyRequest)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte(err.Error()))
					return
				}

				responseBody, err := io.ReadAll(res.Body)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte(err.Error()))
					return
				}

				maps.Copy(res.Header, w.Header())
				w.WriteHeader(res.StatusCode)
				w.Write(responseBody)
				return
			} else {
				serveSite(w, r, siteFolder)
			}

			return
		})
	}
}

// ingressPrefix returns the path prefix the site is being served under, without
// a trailing slash. Empty for direct access or an unrecognized header value.
func ingressPrefix(r *http.Request) string {
	prefix := strings.TrimRight(r.Header.Get(ingressPathHeader), "/")
	if prefix == "" || !validIngressPath.MatchString(prefix) {
		return ""
	}

	return prefix
}

// serveSite serves a file from the built site, substituting the ingress prefix
func serveSite(w http.ResponseWriter, r *http.Request, root string) {
	subpath := path.Clean("/" + r.URL.Path)
	filePath := filepath.Join(root, filepath.FromSlash(subpath))

	if info, err := os.Stat(filePath); err == nil && info.IsDir() {
		subpath = path.Join(subpath, "index.html")
		filePath = filepath.Join(root, filepath.FromSlash(subpath))
	}

	fileBytes, err := os.ReadFile(filePath)
	if err != nil {
		if os.IsNotExist(err) {
			http.NotFound(w, r)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	ext := path.Ext(subpath)
	if rewritableExtensions[ext] {
		fileBytes = bytes.ReplaceAll(fileBytes, []byte(sitePrefixPlaceholder), []byte(ingressPrefix(r)))
	}

	contentType := mime.TypeByExtension(ext)
	if contentType == "" {
		contentType = mimetype.Detect(fileBytes).String()
	}
	w.Header().Set("Content-Type", contentType)

	// Entry points and page data reference hashed assets; don't let them go stale
	if ext == ".html" || strings.HasPrefix(subpath, "/page-data/") || subpath == "/chunk-map.json" {
		w.Header().Set("Cache-Control", "no-cache")
	}

	w.Write(fileBytes)
}
