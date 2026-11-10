package api

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/logstore"
)

const (
	// Room for a few batches of entries, but nowhere near enough for abuse
	maxLogsBodyBytes = 16 * 1024
)

type PostLogsRequest struct {
	Body PostLogsRequestBody
}

type PostLogsRequestBody struct {
	Switch   string        `json:"switch" minLength:"1" maxLength:"100" doc:"Name of the switch reporting the logs"`
	Version  string        `json:"version,omitempty" maxLength:"64" doc:"Firmware version of the switch"`
	UptimeMs int64         `json:"uptime_ms" minimum:"0" doc:"Uptime of the switch, in milliseconds, when the request was sent. Used to estimate when each entry was logged"`
	Logs     []LogEntryReq `json:"logs" maxItems:"100"`
}

type LogEntryReq struct {
	Seq      int64  `json:"seq" minimum:"0" doc:"Counter that increases with every entry the switch logs, including across reboots"`
	UptimeMs int64  `json:"t" minimum:"0" doc:"Uptime of the switch, in milliseconds, when the entry was logged"`
	Level    string `json:"lvl" maxLength:"16" example:"info" doc:"Severity, e.g. info, warn or error"`
	Message  string `json:"msg" maxLength:"500"`
}

type PostLogsResponse struct {
	Body PostLogsResponseBody
}

type PostLogsResponseBody struct {
	Accepted int `json:"accepted" doc:"How many entries were new. The rest were already stored"`
}

func (s *server) RegisterPostLogs(api huma.API) {
	huma.Register(api, huma.Operation{
		Method:       http.MethodPost,
		OperationID:  "postLogs",
		Path:         "/api/logs",
		Summary:      "Upload log entries from a switch",
		Description:  "Entries already stored are ignored, so a switch can safely resend entries it hasn't had acknowledged.",
		MaxBodyBytes: maxLogsBodyBytes,
		Errors: []int{
			http.StatusInternalServerError,
		},
	}, s.postLogs)
}

func (s *server) postLogs(ctx context.Context, req *PostLogsRequest) (*PostLogsResponse, error) {
	entries := make([]logstore.Entry, 0, len(req.Body.Logs))
	for _, l := range req.Body.Logs {
		entries = append(entries, logstore.Entry{
			Seq:      l.Seq,
			UptimeMs: l.UptimeMs,
			Level:    l.Level,
			Message:  l.Message,
		})
	}

	// Unlike a button press, logs are accepted from switches that haven't been
	// configured yet, since that is when they are most useful.
	accepted, err := s.logs.Append(req.Body.Switch, req.Body.UptimeMs, entries)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to store logs", err)
	}

	return &PostLogsResponse{
		Body: PostLogsResponseBody{Accepted: accepted},
	}, nil
}

type GetLogsRequest struct {
	Switch string `query:"switch" required:"true" minLength:"1" maxLength:"100" doc:"Name of the switch to fetch logs for"`
}

type GetLogsResponse struct {
	Body GetLogsResponseBody
}

type GetLogsResponseBody struct {
	Logs []LogEntry `json:"logs" doc:"Stored entries, oldest first"`
}

type LogEntry struct {
	Seq      int64     `json:"seq"`
	UptimeMs int64     `json:"t"`
	Level    string    `json:"lvl"`
	Message  string    `json:"msg"`
	Time     time.Time `json:"time" doc:"Estimated time the entry was logged"`
}

func (s *server) RegisterGetLogs(api huma.API) {
	huma.Register(api, huma.Operation{
		Method:      http.MethodGet,
		OperationID: "getLogs",
		Path:        "/api/logs",
		Summary:     "Fetch the stored log entries for a switch",
		Errors: []int{
			http.StatusInternalServerError,
		},
	}, s.getLogs)
}

func (s *server) getLogs(ctx context.Context, req *GetLogsRequest) (*GetLogsResponse, error) {
	stored, err := s.logs.List(req.Switch)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to read logs", err)
	}

	logs := make([]LogEntry, 0, len(stored))
	for _, e := range stored {
		logs = append(logs, LogEntry{
			Seq:      e.Seq,
			UptimeMs: e.UptimeMs,
			Level:    e.Level,
			Message:  e.Message,
			Time:     e.Time,
		})
	}

	return &GetLogsResponse{
		Body: GetLogsResponseBody{Logs: logs},
	}, nil
}
