package model

// LayoutVersion is an enum representing supported layout versions
type LayoutVersion string

const (
	V3 LayoutVersion = "v3"
	V4 LayoutVersion = "v4"
	V5 LayoutVersion = "v5"
	V6 LayoutVersion = "v6"
	V7 LayoutVersion = "v7"
	V9 LayoutVersion = "v9"
)

// LayoutDefinition defines the structure and capabilities of a layout version
type LayoutDefinition struct {
	Version     LayoutVersion
	Description string
	Buttons     []string
}

// LayoutDefinitions contains all supported layout versions
var LayoutDefinitions = map[LayoutVersion]LayoutDefinition{
	V3: {
		Version:     V3,
		Description: "Legacy 12-button layout",
		Buttons: []string{
			"on",
			"off",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"10",
			"11",
			"12",
		},
	},
	V4: {
		Version:     V4,
		Description: "Legacy 8-button layout",
		Buttons: []string{
			"on",
			"off",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
		},
	},
	V5: {
		Version:     V5,
		Description: "Legacy dial layout",
		Buttons: []string{
			"on",
			"off",
			"5",
			"6",
			"7",
			"8",
		},
	},
	V6: {
		Version:     V6,
		Description: "Legacy dial layout with power switch",
		Buttons: []string{
			"on",
			"off",
			"5",
			"6",
			"7",
			"8",
		},
	},
	V7: {
		Version:     V7,
		Description: "Legacy 8-button layout (revised pinout)",
		Buttons: []string{
			"on",
			"off",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
		},
	},
	V9: {
		Version:     V9,
		Description: "Second fully enclosed case",
		Buttons: []string{
			"on",
			"off",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
		},
	},
}

// LayoutInstance represents a user's configured layout instance
type LayoutInstance struct {
	Version LayoutVersion      `json:"version"`
	Buttons map[string]Command `json:"buttons"`
	Flipped bool               `json:"flipped"`
}
