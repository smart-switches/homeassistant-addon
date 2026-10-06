package api

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/danielgtaylor/huma/v2/humatest"
)

func TestPing(t *testing.T) {
	_, api := humatest.New(t)

	s := &server{}
	s.RegisterPing(api)

	resp := api.Get("/api/ping")

	if resp.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", resp.Code)
	}

	var body PingResponseBody
	if err := json.Unmarshal(resp.Body.Bytes(), &body); err != nil {
		t.Fatalf("failed to decode body: %v", err)
	}

	if body.Message != "pong" {
		t.Fatalf("expected message pong, got %q", body.Message)
	}
}
