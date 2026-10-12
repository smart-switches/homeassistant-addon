package api

import (
	"context"
	"fmt"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/model"
)

type GetSwitchRequest struct {
	Name          string `path:"name" doc:"Name of the switch"`
	LayoutVersion string `path:"layout-version" doc:"Layout version configured on the switch"`
}

type GetSwitchResponse struct {
	Body model.LayoutInstance
}

func (s *server) RegisterGetSwitch(api huma.API) {
	huma.Register(api, huma.Operation{
		Method:      http.MethodGet,
		OperationID: "get-switch",
		Path:        "/api/switches/{name}/{layout-version}",
		Errors: []int{
			http.StatusNotFound,
			http.StatusInternalServerError,
		},
	}, s.getSwitch)
}

func (s *server) getSwitch(ctx context.Context, req *GetSwitchRequest) (*GetSwitchResponse, error) {
	sw, ok := s.cfg.Switches[req.Name]
	if !ok {
		return nil, huma.Error404NotFound(fmt.Sprintf("No switch named %q", req.Name))
	}

	layout, ok := sw.Layouts[model.LayoutVersion(req.LayoutVersion)]
	if !ok {
		return nil, huma.Error404NotFound(fmt.Sprintf("Layout %q not configured for switch %q", req.LayoutVersion, req.Name))
	}

	return &GetSwitchResponse{Body: layout}, nil
}
