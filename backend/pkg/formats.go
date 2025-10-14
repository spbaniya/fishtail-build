package pkg

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io"
	"strings"

	"gopkg.in/yaml.v3"
)

// FileFormat defines the interface for different file formats
type FileFormat interface {
	// Parse reads data from an io.Reader and returns a slice of maps
	Parse(r io.Reader) ([]map[string]any, error)

	// Serialize writes a slice of maps to an io.Writer
	Serialize(w io.Writer, data []map[string]any) error

	// Extension returns the file extension for this format
	Extension() string

	// ContentType returns the MIME content type
	ContentType() string
}

// JSONFormat handles JSON files
type JSONFormat struct{}

func (f *JSONFormat) Parse(r io.Reader) ([]map[string]any, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return nil, fmt.Errorf("failed to read data: %w", err)
	}

	if len(data) == 0 {
		return []map[string]any{}, nil
	}

	var items []map[string]any
	if err := json.Unmarshal(data, &items); err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %w", err)
	}

	return items, nil
}

func (f *JSONFormat) Serialize(w io.Writer, data []map[string]any) error {
	encoder := json.NewEncoder(w)
	encoder.SetIndent("", "  ")
	return encoder.Encode(data)
}

func (f *JSONFormat) Extension() string {
	return ".json"
}

func (f *JSONFormat) ContentType() string {
	return "application/json"
}

// YAMLFormat handles YAML files
type YAMLFormat struct{}

func (f *YAMLFormat) Parse(r io.Reader) ([]map[string]any, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return nil, fmt.Errorf("failed to read data: %w", err)
	}

	if len(data) == 0 {
		return []map[string]any{}, nil
	}

	var items []map[string]any
	if err := yaml.Unmarshal(data, &items); err != nil {
		return nil, fmt.Errorf("failed to parse YAML: %w", err)
	}

	return items, nil
}

func (f *YAMLFormat) Serialize(w io.Writer, data []map[string]any) error {
	encoder := yaml.NewEncoder(w)
	encoder.SetIndent(2)
	return encoder.Encode(data)
}

func (f *YAMLFormat) Extension() string {
	return ".yaml"
}

func (f *YAMLFormat) ContentType() string {
	return "application/yaml"
}

// CSVFormat handles CSV files
type CSVFormat struct{}

func (f *CSVFormat) Parse(r io.Reader) ([]map[string]any, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return nil, fmt.Errorf("failed to read data: %w", err)
	}

	if len(data) == 0 {
		return []map[string]any{}, nil
	}

	lines := strings.Split(strings.TrimSpace(string(data)), "\n")
	if len(lines) < 2 {
		return []map[string]any{}, nil
	}

	headers := strings.Split(lines[0], ",")
	for i, header := range headers {
		headers[i] = strings.TrimSpace(header)
	}

	var items []map[string]any
	for _, line := range lines[1:] {
		if strings.TrimSpace(line) == "" {
			continue
		}

		values := strings.Split(line, ",")
		if len(values) != len(headers) {
			continue // Skip malformed lines
		}

		item := make(map[string]any)
		for i, value := range values {
			item[headers[i]] = strings.TrimSpace(value)
		}
		items = append(items, item)
	}

	return items, nil
}

func (f *CSVFormat) Serialize(w io.Writer, data []map[string]any) error {
	if len(data) == 0 {
		return nil
	}

	// Get all unique headers
	headerSet := make(map[string]bool)
	for _, item := range data {
		for key := range item {
			headerSet[key] = true
		}
	}

	var headers []string
	for header := range headerSet {
		headers = append(headers, header)
	}

	// Write headers
	if _, err := fmt.Fprintln(w, strings.Join(headers, ",")); err != nil {
		return err
	}

	// Write data rows
	for _, item := range data {
		var values []string
		for _, header := range headers {
			if val, ok := item[header]; ok {
				values = append(values, fmt.Sprintf("%v", val))
			} else {
				values = append(values, "")
			}
		}
		if _, err := fmt.Fprintln(w, strings.Join(values, ",")); err != nil {
			return err
		}
	}

	return nil
}

func (f *CSVFormat) Extension() string {
	return ".csv"
}

func (f *CSVFormat) ContentType() string {
	return "text/csv"
}

// XMLFormat handles XML files
type XMLFormat struct{}

func (f *XMLFormat) Parse(r io.Reader) ([]map[string]any, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return nil, fmt.Errorf("failed to read data: %w", err)
	}

	if len(data) == 0 {
		return []map[string]any{}, nil
	}

	// Simple XML parsing - assumes root element contains items
	var root struct {
		Items []map[string]any `xml:",any"`
	}

	if err := xml.Unmarshal(data, &root); err != nil {
		return nil, fmt.Errorf("failed to parse XML: %w", err)
	}

	return root.Items, nil
}

func (f *XMLFormat) Serialize(w io.Writer, data []map[string]any) error {
	// Simple XML serialization
	root := struct {
		XMLName xml.Name         `xml:"root"`
		Items   []map[string]any `xml:"item"`
	}{
		Items: data,
	}

	encoder := xml.NewEncoder(w)
	encoder.Indent("", "  ")
	if err := encoder.Encode(root); err != nil {
		return err
	}

	return nil
}

func (f *XMLFormat) Extension() string {
	return ".xml"
}

func (f *XMLFormat) ContentType() string {
	return "application/xml"
}

// FormatRegistry manages available file formats
type FormatRegistry struct {
	formats map[string]FileFormat
}

func NewFormatRegistry() *FormatRegistry {
	registry := &FormatRegistry{
		formats: make(map[string]FileFormat),
	}

	// Register default formats
	registry.Register(&JSONFormat{})
	registry.Register(&YAMLFormat{})
	registry.Register(&CSVFormat{})
	registry.Register(&XMLFormat{})

	return registry
}

func (r *FormatRegistry) Register(format FileFormat) {
	r.formats[format.Extension()] = format
}

func (r *FormatRegistry) Get(extension string) (FileFormat, error) {
	format, ok := r.formats[extension]
	if !ok {
		return nil, fmt.Errorf("unsupported file format: %s", extension)
	}
	return format, nil
}

func (r *FormatRegistry) GetByContentType(contentType string) (FileFormat, error) {
	for _, format := range r.formats {
		if format.ContentType() == contentType {
			return format, nil
		}
	}
	return nil, fmt.Errorf("unsupported content type: %s", contentType)
}

func (r *FormatRegistry) SupportedExtensions() []string {
	var extensions []string
	for ext := range r.formats {
		extensions = append(extensions, ext)
	}
	return extensions
}
