package api

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func newTestSite(t *testing.T) string {
	t.Helper()

	root := t.TempDir()
	files := map[string]string{
		"index.html":                  `<script src="/__INGRESS_PREFIX__/app-1.js"></script>`,
		"404/index.html":              `not found page`,
		"app-1.js":                    `fetch("/__INGRESS_PREFIX__/page-data/index/page-data.json")`,
		"page-data/app-data.json":     `{}`,
		"logo.png":                    "/__INGRESS_PREFIX__ binary",
		"../outside-the-site-root.js": "secret",
	}

	for name, content := range files {
		full := filepath.Join(root, name)
		if err := os.MkdirAll(filepath.Dir(full), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(full, []byte(content), 0o644); err != nil {
			t.Fatal(err)
		}
	}

	return root
}

func serve(t *testing.T, root, urlPath, ingressPath string) *httptest.ResponseRecorder {
	t.Helper()

	req := httptest.NewRequest(http.MethodGet, "http://example.test"+urlPath, nil)
	if ingressPath != "" {
		req.Header.Set(ingressPathHeader, ingressPath)
	}

	rec := httptest.NewRecorder()
	serveSite(rec, req, root)
	return rec
}

func TestServeSiteIngressPrefix(t *testing.T) {
	root := newTestSite(t)

	rec := serve(t, root, "/", "/api/hassio_ingress/abc123")
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d", rec.Code)
	}
	if got, want := rec.Body.String(), `<script src="/api/hassio_ingress/abc123/app-1.js"></script>`; got != want {
		t.Errorf("body = %q, want %q", got, want)
	}
	if got := rec.Header().Get("Content-Type"); !strings.HasPrefix(got, "text/html") {
		t.Errorf("content type = %q", got)
	}
	if got := rec.Header().Get("Cache-Control"); got != "no-cache" {
		t.Errorf("cache control = %q", got)
	}

	rec = serve(t, root, "/app-1.js", "/api/hassio_ingress/abc123/")
	if got, want := rec.Body.String(), `fetch("/api/hassio_ingress/abc123/page-data/index/page-data.json")`; got != want {
		t.Errorf("js body = %q, want %q", got, want)
	}
}

func TestServeSiteDirectAccess(t *testing.T) {
	root := newTestSite(t)

	rec := serve(t, root, "/", "")
	if got, want := rec.Body.String(), `<script src="/app-1.js"></script>`; got != want {
		t.Errorf("body = %q, want %q", got, want)
	}

	// A malformed header must not be injected into the page
	rec = serve(t, root, "/", `/"><script>alert(1)</script>`)
	if got, want := rec.Body.String(), `<script src="/app-1.js"></script>`; got != want {
		t.Errorf("body with bad header = %q, want %q", got, want)
	}
}

func TestServeSiteLeavesBinaryFilesAlone(t *testing.T) {
	rec := serve(t, newTestSite(t), "/logo.png", "/api/hassio_ingress/abc123")
	if got, want := rec.Body.String(), "/__INGRESS_PREFIX__ binary"; got != want {
		t.Errorf("body = %q, want %q", got, want)
	}
}

func TestServeSiteDirectoryIndex(t *testing.T) {
	rec := serve(t, newTestSite(t), "/404", "")
	if rec.Code != http.StatusOK || rec.Body.String() != "not found page" {
		t.Errorf("got %d %q", rec.Code, rec.Body.String())
	}
}

func TestServeSiteMissingAndTraversal(t *testing.T) {
	root := newTestSite(t)

	for _, p := range []string{"/nope.js", "/../outside-the-site-root.js", "/%2e%2e/outside-the-site-root.js"} {
		if rec := serve(t, root, p, ""); rec.Code != http.StatusNotFound {
			t.Errorf("%s: status = %d, want 404", p, rec.Code)
		}
	}
}
