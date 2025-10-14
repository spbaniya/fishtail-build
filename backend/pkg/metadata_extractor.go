package pkg

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

// FileMetadata contains comprehensive metadata about a file
type FileMetadata struct {
	Filename    string                   `json:"filename"`
	Extension   string                   `json:"extension"`
	Size        int64                    `json:"size"`
	Modified    time.Time                `json:"modified"`
	Format      string                   `json:"format"`
	Schema      *SchemaInfo              `json:"schema"`
	RowCount    int                      `json:"rowCount"`
	ColumnCount int                      `json:"columnCount"`
	Encoding    string                   `json:"encoding"`
	Headers     []string                 `json:"headers,omitempty"`
	SampleData  []map[string]interface{} `json:"sampleData"`
	Stats       map[string]interface{}   `json:"stats"`
	Validation  map[string]interface{}   `json:"validation"`
}

// MetadataExtractor extracts comprehensive metadata from files
type MetadataExtractor struct {
	schemaGenerator *SchemaGenerator
	maxSampleRows   int
}

// NewMetadataExtractor creates a new metadata extractor
func NewMetadataExtractor() *MetadataExtractor {
	return &MetadataExtractor{
		schemaGenerator: NewSchemaGenerator(),
		maxSampleRows:   5, // Limit sample data for performance
	}
}

// ExtractMetadata extracts comprehensive metadata from a file
func (me *MetadataExtractor) ExtractMetadata(filePath string) (*FileMetadata, error) {
	// Get basic file information
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to stat file: %w", err)
	}

	// Determine format from extension
	ext := strings.ToLower(filepath.Ext(filePath))
	format := strings.TrimPrefix(ext, ".")

	// Create file manager
	fm, err := NewFileManager(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to create file manager: %w", err)
	}

	// Read all data
	data, err := fm.Read()
	if err != nil {
		return nil, fmt.Errorf("failed to read file data: %w", err)
	}

	// Generate schema
	schema, err := me.schemaGenerator.GenerateSchema(data)
	if err != nil {
		return nil, fmt.Errorf("failed to generate schema: %w", err)
	}

	// Extract additional metadata based on format
	var headers []string
	var encoding string

	switch format {
	case "csv":
		headers, encoding = me.extractCSVMetadata(filePath)
	case "json":
		encoding = "UTF-8" // Assume UTF-8 for JSON
	case "xml":
		encoding = "UTF-8" // Assume UTF-8 for XML
	case "yaml", "yml":
		encoding = "UTF-8" // Assume UTF-8 for YAML
	default:
		encoding = "unknown"
	}

	// Generate sample data
	sampleData := me.generateSampleData(data, me.maxSampleRows)

	// Generate statistics
	stats := me.generateStatistics(data, schema)

	// Generate validation info
	validation := me.generateValidationInfo(data, schema)

	return &FileMetadata{
		Filename:    filepath.Base(filePath),
		Extension:   ext,
		Size:        fileInfo.Size(),
		Modified:    fileInfo.ModTime(),
		Format:      format,
		Schema:      schema,
		RowCount:    len(data),
		ColumnCount: len(schema.Fields),
		Encoding:    encoding,
		Headers:     headers,
		SampleData:  sampleData,
		Stats:       stats,
		Validation:  validation,
	}, nil
}

// extractCSVMetadata extracts CSV-specific metadata
func (me *MetadataExtractor) extractCSVMetadata(filePath string) ([]string, string) {
	// For CSV files, we can try to detect encoding and headers
	// For now, return basic information
	return []string{}, "UTF-8"
}

// generateSampleData generates sample data for preview
func (me *MetadataExtractor) generateSampleData(data []map[string]interface{}, maxRows int) []map[string]interface{} {
	if len(data) <= maxRows {
		return data
	}

	// Return first maxRows items
	sample := make([]map[string]interface{}, maxRows)
	copy(sample, data[:maxRows])
	return sample
}

// generateStatistics generates statistical information about the data
func (me *MetadataExtractor) generateStatistics(data []map[string]interface{}, schema *SchemaInfo) map[string]interface{} {
	stats := make(map[string]interface{})

	stats["totalRows"] = len(data)
	stats["totalColumns"] = len(schema.Fields)
	stats["fieldStats"] = me.generateFieldStatistics(data, schema.Fields)

	return stats
}

// generateFieldStatistics generates statistics for each field
func (me *MetadataExtractor) generateFieldStatistics(data []map[string]interface{}, fields []*FieldInfo) map[string]interface{} {
	fieldStats := make(map[string]interface{})

	for _, field := range fields {
		values := me.extractFieldValues(data, field.Name)
		fieldStats[field.Name] = me.calculateFieldStats(values, field.Type)
	}

	return fieldStats
}

// extractFieldValues extracts all values for a specific field
func (me *MetadataExtractor) extractFieldValues(data []map[string]interface{}, fieldName string) []interface{} {
	var values []interface{}
	for _, item := range data {
		if value, exists := item[fieldName]; exists {
			values = append(values, value)
		}
	}
	return values
}

// calculateFieldStats calculates statistics for field values
func (me *MetadataExtractor) calculateFieldStats(values []interface{}, fieldType FieldType) map[string]interface{} {
	stats := make(map[string]interface{})

	if len(values) == 0 {
		return stats
	}

	stats["count"] = len(values)
	stats["type"] = string(fieldType)

	switch fieldType {
	case FieldTypeString:
		stats["uniqueCount"] = me.countUnique(values)
		stats["avgLength"] = me.calculateAverageLength(values)
		stats["minLength"] = me.calculateMinLength(values)
		stats["maxLength"] = me.calculateMaxLength(values)
	case FieldTypeInteger, FieldTypeNumber:
		stats["min"] = me.calculateMin(values)
		stats["max"] = me.calculateMax(values)
		stats["avg"] = me.calculateAverage(values)
		stats["uniqueCount"] = me.countUnique(values)
	case FieldTypeBoolean:
		trueCount := 0
		for _, value := range values {
			if boolVal, ok := value.(bool); ok && boolVal {
				trueCount++
			}
		}
		stats["trueCount"] = trueCount
		stats["falseCount"] = len(values) - trueCount
		stats["truePercentage"] = float64(trueCount) / float64(len(values)) * 100
	}

	return stats
}

// Helper functions for statistics
func (me *MetadataExtractor) countUnique(values []interface{}) int {
	unique := make(map[string]bool)
	for _, value := range values {
		unique[fmt.Sprintf("%v", value)] = true
	}
	return len(unique)
}

func (me *MetadataExtractor) calculateAverageLength(values []interface{}) float64 {
	if len(values) == 0 {
		return 0
	}

	total := 0
	for _, value := range values {
		if str, ok := value.(string); ok {
			total += len(str)
		}
	}
	return float64(total) / float64(len(values))
}

func (me *MetadataExtractor) calculateMinLength(values []interface{}) int {
	min := -1
	for _, value := range values {
		if str, ok := value.(string); ok {
			if length := len(str); min == -1 || length < min {
				min = length
			}
		}
	}
	return min
}

func (me *MetadataExtractor) calculateMaxLength(values []interface{}) int {
	max := 0
	for _, value := range values {
		if str, ok := value.(string); ok {
			if length := len(str); length > max {
				max = length
			}
		}
	}
	return max
}

func (me *MetadataExtractor) calculateMin(values []interface{}) interface{} {
	if len(values) == 0 {
		return nil
	}

	min := values[0]
	for _, value := range values[1:] {
		if me.compareValues(value, min) < 0 {
			min = value
		}
	}
	return min
}

func (me *MetadataExtractor) calculateMax(values []interface{}) interface{} {
	if len(values) == 0 {
		return nil
	}

	max := values[0]
	for _, value := range values[1:] {
		if me.compareValues(value, max) > 0 {
			max = value
		}
	}
	return max
}

func (me *MetadataExtractor) calculateAverage(values []interface{}) float64 {
	if len(values) == 0 {
		return 0
	}

	sum := 0.0
	count := 0

	for _, value := range values {
		if num, ok := me.toFloat(value); ok {
			sum += num
			count++
		}
	}

	if count == 0 {
		return 0
	}
	return sum / float64(count)
}

func (me *MetadataExtractor) toFloat(value interface{}) (float64, bool) {
	switch v := value.(type) {
	case int:
		return float64(v), true
	case int8:
		return float64(v), true
	case int16:
		return float64(v), true
	case int32:
		return float64(v), true
	case int64:
		return float64(v), true
	case float32:
		return float64(v), true
	case float64:
		return v, true
	default:
		return 0, false
	}
}

func (me *MetadataExtractor) compareValues(a, b interface{}) int {
	aStr := fmt.Sprintf("%v", a)
	bStr := fmt.Sprintf("%v", b)
	if aStr < bStr {
		return -1
	} else if aStr > bStr {
		return 1
	}
	return 0
}

// generateValidationInfo generates validation information
func (me *MetadataExtractor) generateValidationInfo(data []map[string]interface{}, schema *SchemaInfo) map[string]interface{} {
	validation := make(map[string]interface{})

	// Check for missing required fields
	missingRequired := make(map[string]int)
	for _, field := range schema.Fields {
		if field.Required {
			count := 0
			for _, item := range data {
				if _, exists := item[field.Name]; !exists {
					count++
				}
			}
			if count > 0 {
				missingRequired[field.Name] = count
			}
		}
	}

	if len(missingRequired) > 0 {
		validation["missingRequiredFields"] = missingRequired
	}

	// Check for data type consistency
	typeIssues := make(map[string][]int)
	for i, item := range data {
		for _, field := range schema.Fields {
			if value, exists := item[field.Name]; exists {
				if !me.isValidType(value, field.Type) {
					if typeIssues[field.Name] == nil {
						typeIssues[field.Name] = []int{}
					}
					typeIssues[field.Name] = append(typeIssues[field.Name], i)
				}
			}
		}
	}

	if len(typeIssues) > 0 {
		validation["typeInconsistencies"] = typeIssues
	}

	validation["isValid"] = len(missingRequired) == 0 && len(typeIssues) == 0

	return validation
}

// isValidType checks if a value matches the expected type
func (me *MetadataExtractor) isValidType(value interface{}, fieldType FieldType) bool {
	switch fieldType {
	case FieldTypeString:
		_, ok := value.(string)
		return ok
	case FieldTypeInteger:
		switch value.(type) {
		case int, int8, int16, int32, int64:
			return true
		default:
			return false
		}
	case FieldTypeNumber:
		switch value.(type) {
		case int, int8, int16, int32, int64, float32, float64:
			return true
		default:
			return false
		}
	case FieldTypeBoolean:
		_, ok := value.(bool)
		return ok
	case FieldTypeArray:
		_, ok := value.([]interface{})
		return ok
	case FieldTypeObject:
		_, ok := value.(map[string]interface{})
		return ok
	default:
		return true
	}
}

// ExtractMetadataFromDirectory extracts metadata for all supported files in a directory
func (me *MetadataExtractor) ExtractMetadataFromDirectory(dirPath string) (map[string]*FileMetadata, error) {
	files, err := os.ReadDir(dirPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read directory: %w", err)
	}

	metadata := make(map[string]*FileMetadata)

	for _, file := range files {
		if file.IsDir() {
			continue
		}

		filePath := filepath.Join(dirPath, file.Name())
		ext := strings.ToLower(filepath.Ext(filePath))

		// Only process supported formats
		supportedExts := []string{".json", ".csv", ".xml", ".yaml", ".yml"}
		supported := false
		for _, supportedExt := range supportedExts {
			if ext == supportedExt {
				supported = true
				break
			}
		}

		if !supported {
			continue
		}

		fileMetadata, err := me.ExtractMetadata(filePath)
		if err != nil {
			// Log error but continue with other files
			continue
		}

		metadata[file.Name()] = fileMetadata
	}

	return metadata, nil
}

// GetFileStructure returns a summary of file structure
func (me *MetadataExtractor) GetFileStructure(filePath string) (map[string]interface{}, error) {
	metadata, err := me.ExtractMetadata(filePath)
	if err != nil {
		return nil, err
	}

	structure := map[string]interface{}{
		"filename":    metadata.Filename,
		"format":      metadata.Format,
		"size":        metadata.Size,
		"rowCount":    metadata.RowCount,
		"columnCount": metadata.ColumnCount,
		"fields":      me.getFieldSummaries(metadata.Schema.Fields),
		"sampleData":  metadata.SampleData,
		"stats":       metadata.Stats,
		"validation":  metadata.Validation,
	}

	return structure, nil
}

// getFieldSummaries returns field summaries for display
func (me *MetadataExtractor) getFieldSummaries(fields []*FieldInfo) []map[string]interface{} {
	summaries := make([]map[string]interface{}, len(fields))

	for i, field := range fields {
		summary := map[string]interface{}{
			"name":     field.Name,
			"type":     field.Type,
			"required": field.Required,
			"unique":   field.Unique,
		}

		if len(field.Enum) > 0 {
			summary["enum"] = field.Enum
		}

		if field.Description != "" {
			summary["description"] = field.Description
		}

		summaries[i] = summary
	}

	// Sort by name for consistent display
	sort.Slice(summaries, func(i, j int) bool {
		return summaries[i]["name"].(string) < summaries[j]["name"].(string)
	})

	return summaries
}
