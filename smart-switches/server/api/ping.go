package api

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
)

type PingResponse struct {
	Body PingResponseBody
}

type PingResponseBody struct {
	Message string `json:"message" example:"pong" doc:"Always 'pong' when the server is reachable"`
}

func (s *server) RegisterPing(api huma.API) {
	huma.Register(api, huma.Operation{
		Method:      http.MethodGet,
		OperationID: "ping",
		Path:        "/api/ping",
		Summary:     "Validate connectivity to the server",
	}, s.ping)
}

func (s *server) ping(ctx context.Context, request *struct{}) (*PingResponse, error) {
	return &PingResponse{
		Body: PingResponseBody{
			Message: "pong",
		},
	}, nil
}
