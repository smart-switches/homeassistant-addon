package api

import (
	"encoding/json"
	"net/http"
	"strings"
	"testing"

	"github.com/danielgtaylor/huma/v2/humatest"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/logstore"
)

func newLogsTestAPI(t *testing.T) humatest.TestAPI {
	t.Helper()

	_, api := humatest.New(t)

	s := &server{logs: logstore.New(t.TempDir(), 10)}
	s.RegisterPostLogs(api)
	s.RegisterGetLogs(api)

	return api
}

func logsBody(switchName string, entries ...map[string]any) map[string]any {
	if entries == nil {
		entries = []map[string]any{}
	}

	return map[string]any{
		"switch":    switchName,
		"version":   "1.2.3",
		"uptime_ms": 10_000,
		"logs":      entries,
	}
}

func logEntry(seq int, msg string) map[string]any {
	return map[string]any{"seq": seq, "t": seq * 1000, "lvl": "info", "msg": msg}
}

func decode[T any](t *testing.T, body []byte) T {
	t.Helper()

	var v T
	if err := json.Unmarshal(body, &v); err != nil {
		t.Fatalf("failed to decode %q: %v", body, err)
	}

	return v
}

func TestPostLogsStoresEntries(t *testing.T) {
	api := newLogsTestAPI(t)

	// Status must be exactly 200: the firmware doesn't accept other 2xx codes
	resp := api.Post("/api/logs", logsBody("kitchen", logEntry(1, "a"), logEntry(2, "b")))
	if resp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", resp.Code, resp.Body.String())
	}

	if got := decode[PostLogsResponseBody](t, resp.Body.Bytes()); got.Accepted != 2 {
		t.Fatalf("expected 2 accepted, got %d", got.Accepted)
	}

	resp = api.Get("/api/logs?switch=kitchen")
	if resp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", resp.Code, resp.Body.String())
	}

	got := decode[GetLogsResponseBody](t, resp.Body.Bytes())
	if len(got.Logs) != 2 || got.Logs[0].Message != "a" || got.Logs[1].Message != "b" {
		t.Fatalf("unexpected logs: %+v", got.Logs)
	}
	if got.Logs[0].Time.IsZero() {
		t.Fatal("expected a time to be estimated")
	}
}

func TestPostLogsIgnoresResentEntries(t *testing.T) {
	api := newLogsTestAPI(t)

	api.Post("/api/logs", logsBody("kitchen", logEntry(1, "a")))
	resp := api.Post("/api/logs", logsBody("kitchen", logEntry(1, "a"), logEntry(2, "b")))

	if got := decode[PostLogsResponseBody](t, resp.Body.Bytes()); got.Accepted != 1 {
		t.Fatalf("expected 1 accepted, got %d", got.Accepted)
	}

	resp = api.Get("/api/logs?switch=kitchen")
	if got := decode[GetLogsResponseBody](t, resp.Body.Bytes()); len(got.Logs) != 2 {
		t.Fatalf("expected 2 logs, got %+v", got.Logs)
	}
}

func TestPostLogsAcceptsUnconfiguredSwitch(t *testing.T) {
	api := newLogsTestAPI(t)

	resp := api.Post("/api/logs", logsBody("brand new switch", logEntry(1, "hello")))
	if resp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", resp.Code, resp.Body.String())
	}
}

func TestPostLogsAcceptsEmptyBatch(t *testing.T) {
	api := newLogsTestAPI(t)

	resp := api.Post("/api/logs", logsBody("kitchen"))
	if resp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", resp.Code, resp.Body.String())
	}
}

func TestPostLogsRejectsInvalidBodies(t *testing.T) {
	api := newLogsTestAPI(t)

	tooMany := make([]map[string]any, 101)
	for i := range tooMany {
		tooMany[i] = logEntry(i, "x")
	}

	cases := map[string]map[string]any{
		"empty switch":     logsBody("", logEntry(1, "a")),
		"long switch":      logsBody(strings.Repeat("x", 101), logEntry(1, "a")),
		"long message":     logsBody("kitchen", logEntry(1, strings.Repeat("x", 501))),
		"too many entries": logsBody("kitchen", tooMany...),
		"negative uptime": {
			"switch": "kitchen", "uptime_ms": -1, "logs": []any{},
		},
		"missing logs": {
			"switch": "kitchen", "uptime_ms": 1,
		},
	}

	for name, body := range cases {
		t.Run(name, func(t *testing.T) {
			resp := api.Post("/api/logs", body)
			if resp.Code != http.StatusUnprocessableEntity {
				t.Fatalf("expected 422, got %d: %s", resp.Code, resp.Body.String())
			}
		})
	}
}

func TestPostLogsRejectsOversizedBody(t *testing.T) {
	api := newLogsTestAPI(t)

	big := logsBody("kitchen", logEntry(1, strings.Repeat("x", 400)))
	big["version"] = strings.Repeat("v", 20_000)

	resp := api.Post("/api/logs", big)
	if resp.Code != http.StatusRequestEntityTooLarge {
		t.Fatalf("expected 413, got %d: %s", resp.Code, resp.Body.String())
	}
}

func TestGetLogsRequiresSwitch(t *testing.T) {
	api := newLogsTestAPI(t)

	resp := api.Get("/api/logs")
	if resp.Code != http.StatusUnprocessableEntity {
		t.Fatalf("expected 422, got %d: %s", resp.Code, resp.Body.String())
	}
}

func TestGetLogsUnknownSwitchIsEmpty(t *testing.T) {
	api := newLogsTestAPI(t)

	resp := api.Get("/api/logs?switch=nobody")
	if resp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", resp.Code, resp.Body.String())
	}

	// Must serialize as [] rather than null
	if !strings.Contains(resp.Body.String(), `"logs":[]`) {
		t.Fatalf("expected an empty array, got %s", resp.Body.String())
	}
}
