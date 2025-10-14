package pkg

import (
	"fmt"
	"reflect"
	"sort"
	"strings"
)

// FieldType represents the type of a field in the schema
type FieldType string

const (
	FieldTypeString  FieldType = "string"
	FieldTypeNumber  FieldType = "number"
	FieldTypeInteger FieldType = "integer"
	FieldTypeBoolean FieldType = "boolean"
	FieldTypeArray   FieldType = "array"
	FieldTypeObject  FieldType = "object"
)

// FieldInfo contains information about a field
type FieldInfo struct {
	Name        string                `json:"name"`
	Type        FieldType             `json:"type"`
	Required    bool                  `json:"required"`
	Unique      bool                  `json:"unique"`
	Array       bool                  `json:"array"`
	Properties  map[string]*FieldInfo `json:"properties,omitempty"`
	Items       *FieldInfo            `json:"items,omitempty"`
	Enum        []interface{}         `json:"enum,omitempty"`
	Description string                `json:"description,omitempty"`
	Example     interface{}           `json:"example,omitempty"`
}

// SchemaInfo contains complete schema information for a file
type SchemaInfo struct {
	Fields     []*FieldInfo           `json:"fields"`
	PrimaryKey string                 `json:"primaryKey,omitempty"`
	Required   []string               `json:"required"`
	Properties map[string]*FieldInfo  `json:"properties"`
	Schema     map[string]interface{} `json:"schema"`
}

// SchemaGenerator generates JSON schemas from data samples
type SchemaGenerator struct {
	maxSampleSize int
}

// NewSchemaGenerator creates a new schema generator
func NewSchemaGenerator() *SchemaGenerator {
	return &SchemaGenerator{
		maxSampleSize: 1000, // Limit sample size for performance
	}
}

// GenerateSchema analyzes data and generates schema information
func (sg *SchemaGenerator) GenerateSchema(data []map[string]interface{}) (*SchemaInfo, error) {
	if len(data) == 0 {
		return &SchemaInfo{
			Fields:     []*FieldInfo{},
			Required:   []string{},
			Properties: make(map[string]*FieldInfo),
			Schema:     make(map[string]interface{}),
		}, nil
	}

	// Analyze field information
	fieldMap := make(map[string]*FieldInfo)
	fieldValues := make(map[string]map[string]int) // Track unique values for enums

	// First pass: collect field information
	for _, item := range data {
		for field, value := range item {
			if _, exists := fieldMap[field]; !exists {
				fieldMap[field] = &FieldInfo{
					Name:       field,
					Properties: make(map[string]*FieldInfo),
				}
			}

			fieldInfo := fieldMap[field]
			fieldType := sg.inferFieldType(value)

			// Update field type if it's more general
			if !sg.isMoreSpecificType(fieldInfo.Type, fieldType) {
				fieldInfo.Type = fieldType
			}

			// Track values for enum detection
			if fieldValues[field] == nil {
				fieldValues[field] = make(map[string]int)
			}
			fieldValues[field][fmt.Sprintf("%v", value)]++

			// Check if field is array
			if sg.isArray(value) {
				fieldInfo.Array = true
				if arrayItems, ok := value.([]interface{}); ok && len(arrayItems) > 0 {
					// Infer type of array items
					itemType := sg.inferFieldType(arrayItems[0])
					if fieldInfo.Items == nil {
						fieldInfo.Items = &FieldInfo{
							Type: itemType,
						}
					}
				}
			}

			// Check if field is object
			if sg.isObject(value) {
				fieldInfo.Type = FieldTypeObject
				if obj, ok := value.(map[string]interface{}); ok {
					sg.analyzeObjectProperties(obj, fieldInfo.Properties)
				}
			}
		}
	}

	// Second pass: determine required fields and enums
	var fields []*FieldInfo
	totalItems := len(data)

	for field, fieldInfo := range fieldMap {
		// Check if field is required (present in all items)
		fieldInfo.Required = true
		for _, item := range data {
			if _, exists := item[field]; !exists {
				fieldInfo.Required = false
				break
			}
		}

		// Check for unique constraint
		if uniqueValues := fieldValues[field]; len(uniqueValues) == totalItems {
			fieldInfo.Unique = true
		}

		// Check for enum values (if field has few unique values relative to total)
		if uniqueCount := len(fieldValues[field]); uniqueCount <= 10 && uniqueCount < totalItems/2 {
			for value := range fieldValues[field] {
				fieldInfo.Enum = append(fieldInfo.Enum, value)
			}
			sort.Slice(fieldInfo.Enum, func(i, j int) bool {
				return fmt.Sprintf("%v", fieldInfo.Enum[i]) < fmt.Sprintf("%v", fieldInfo.Enum[j])
			})
		}

		// Set example value
		if len(data) > 0 {
			if sample, exists := data[0][field]; exists {
				fieldInfo.Example = sample
			}
		}

		fields = append(fields, fieldInfo)
	}

	// Sort fields by name for consistent output
	sort.Slice(fields, func(i, j int) bool {
		return fields[i].Name < fields[j].Name
	})

	// Determine primary key (look for 'id' field or first unique field)
	primaryKey := sg.findPrimaryKey(fields)

	// Build JSON schema
	jsonSchema := sg.buildJSONSchema(fields, primaryKey)

	return &SchemaInfo{
		Fields:     fields,
		PrimaryKey: primaryKey,
		Required:   sg.getRequiredFields(fields),
		Properties: sg.buildPropertiesMap(fields),
		Schema:     jsonSchema,
	}, nil
}

// inferFieldType determines the type of a value
func (sg *SchemaGenerator) inferFieldType(value interface{}) FieldType {
	if value == nil {
		return FieldTypeString
	}

	switch v := value.(type) {
	case string:
		return FieldTypeString
	case int, int8, int16, int32, int64:
		return FieldTypeInteger
	case float32, float64:
		return FieldTypeNumber
	case bool:
		return FieldTypeBoolean
	case []interface{}:
		return FieldTypeArray
	case map[string]interface{}:
		return FieldTypeObject
	default:
		// Try to convert to string
		if reflect.TypeOf(v).Kind() == reflect.String {
			return FieldTypeString
		}
		return FieldTypeString
	}
}

// isMoreSpecificType checks if newType is more specific than currentType
func (sg *SchemaGenerator) isMoreSpecificType(current, new FieldType) bool {
	// For now, just check if they're different
	return current != "" && current != new
}

// isArray checks if a value is an array
func (sg *SchemaGenerator) isArray(value interface{}) bool {
	_, ok := value.([]interface{})
	return ok
}

// isObject checks if a value is an object
func (sg *SchemaGenerator) isObject(value interface{}) bool {
	_, ok := value.(map[string]interface{})
	return ok
}

// analyzeObjectProperties recursively analyzes object properties
func (sg *SchemaGenerator) analyzeObjectProperties(obj map[string]interface{}, properties map[string]*FieldInfo) {
	for key, value := range obj {
		if _, exists := properties[key]; !exists {
			fieldType := sg.inferFieldType(value)
			properties[key] = &FieldInfo{
				Name: key,
				Type: fieldType,
			}
		}
	}
}

// findPrimaryKey looks for a primary key field
func (sg *SchemaGenerator) findPrimaryKey(fields []*FieldInfo) string {
	// Look for 'id' field first
	for _, field := range fields {
		if strings.ToLower(field.Name) == "id" && field.Unique {
			return field.Name
		}
	}

	// Look for any unique field
	for _, field := range fields {
		if field.Unique {
			return field.Name
		}
	}

	// Default to first field if no unique field found
	if len(fields) > 0 {
		return fields[0].Name
	}

	return ""
}

// getRequiredFields returns list of required field names
func (sg *SchemaGenerator) getRequiredFields(fields []*FieldInfo) []string {
	var required []string
	for _, field := range fields {
		if field.Required {
			required = append(required, field.Name)
		}
	}
	return required
}

// buildPropertiesMap builds a map of field name to field info
func (sg *SchemaGenerator) buildPropertiesMap(fields []*FieldInfo) map[string]*FieldInfo {
	properties := make(map[string]*FieldInfo)
	for _, field := range fields {
		properties[field.Name] = field
	}
	return properties
}

// buildJSONSchema builds a JSON schema from field information
func (sg *SchemaGenerator) buildJSONSchema(fields []*FieldInfo, primaryKey string) map[string]interface{} {
	schema := map[string]interface{}{
		"type":                 "object",
		"properties":           make(map[string]interface{}),
		"additionalProperties": false,
	}

	properties := schema["properties"].(map[string]interface{})
	var required []string

	for _, field := range fields {
		fieldSchema := sg.buildFieldSchema(field)
		properties[field.Name] = fieldSchema

		if field.Required {
			required = append(required, field.Name)
		}
	}

	if len(required) > 0 {
		schema["required"] = required
	}

	return schema
}

// buildFieldSchema builds schema for a single field
func (sg *SchemaGenerator) buildFieldSchema(field *FieldInfo) map[string]interface{} {
	fieldSchema := map[string]interface{}{
		"type": string(field.Type),
	}

	if field.Description != "" {
		fieldSchema["description"] = field.Description
	}

	if len(field.Enum) > 0 {
		fieldSchema["enum"] = field.Enum
	}

	if field.Array {
		fieldSchema["type"] = "array"
		if field.Items != nil {
			fieldSchema["items"] = map[string]interface{}{
				"type": string(field.Items.Type),
			}
		} else {
			fieldSchema["items"] = map[string]interface{}{
				"type": "string",
			}
		}
	}

	if field.Type == FieldTypeObject && len(field.Properties) > 0 {
		fieldSchema["type"] = "object"
		fieldSchema["properties"] = sg.buildPropertiesSchema(field.Properties)
	}

	return fieldSchema
}

// buildPropertiesSchema builds schema for nested object properties
func (sg *SchemaGenerator) buildPropertiesSchema(properties map[string]*FieldInfo) map[string]interface{} {
	props := make(map[string]interface{})
	for name, field := range properties {
		props[name] = sg.buildFieldSchema(field)
	}
	return props
}

// GenerateSchemaFromFile generates schema from a file
func (sg *SchemaGenerator) GenerateSchemaFromFile(filePath string) (*SchemaInfo, error) {
	fm, err := NewFileManager(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to create file manager: %w", err)
	}

	data, err := fm.Read()
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	return sg.GenerateSchema(data)
}

// GenerateSchemaFromCSV generates schema from CSV data
func (sg *SchemaGenerator) GenerateSchemaFromCSV(filePath string) (*SchemaInfo, error) {
	fm, err := NewFileManagerWithFormat(filePath, &CSVFormat{})
	if err != nil {
		return nil, fmt.Errorf("failed to create CSV file manager: %w", err)
	}

	data, err := fm.Read()
	if err != nil {
		return nil, fmt.Errorf("failed to read CSV file: %w", err)
	}

	return sg.GenerateSchema(data)
}

// ValidateDataAgainstSchema validates data against a schema
func (sg *SchemaGenerator) ValidateDataAgainstSchema(data []map[string]interface{}, schema *SchemaInfo) []error {
	var errors []error

	for i, item := range data {
		for _, field := range schema.Fields {
			value, exists := item[field.Name]

			// Check required fields
			if field.Required && !exists {
				errors = append(errors, fmt.Errorf("item %d: missing required field '%s'", i, field.Name))
				continue
			}

			// Skip validation if field doesn't exist and is not required
			if !exists {
				continue
			}

			// Validate field type
			if err := sg.validateFieldValue(value, field); err != nil {
				errors = append(errors, fmt.Errorf("item %d, field '%s': %w", i, field.Name, err))
			}

			// Validate enum values
			if len(field.Enum) > 0 {
				if err := sg.validateEnumValue(value, field); err != nil {
					errors = append(errors, fmt.Errorf("item %d, field '%s': %w", i, field.Name, err))
				}
			}
		}
	}

	return errors
}

// validateFieldValue validates a field value against its type
func (sg *SchemaGenerator) validateFieldValue(value interface{}, field *FieldInfo) error {
	switch field.Type {
	case FieldTypeString:
		if _, ok := value.(string); !ok {
			return fmt.Errorf("expected string, got %T", value)
		}
	case FieldTypeInteger:
		switch value.(type) {
		case int, int8, int16, int32, int64:
			// Valid
		case float32, float64:
			// Check if it's a whole number
			if floatVal, ok := value.(float64); ok {
				if floatVal != float64(int64(floatVal)) {
					return fmt.Errorf("expected integer, got float: %v", floatVal)
				}
			}
		default:
			return fmt.Errorf("expected integer, got %T", value)
		}
	case FieldTypeNumber:
		switch value.(type) {
		case int, int8, int16, int32, int64, float32, float64:
			// Valid
		default:
			return fmt.Errorf("expected number, got %T", value)
		}
	case FieldTypeBoolean:
		if _, ok := value.(bool); !ok {
			return fmt.Errorf("expected boolean, got %T", value)
		}
	case FieldTypeArray:
		if _, ok := value.([]interface{}); !ok {
			return fmt.Errorf("expected array, got %T", value)
		}
	case FieldTypeObject:
		if _, ok := value.(map[string]interface{}); !ok {
			return fmt.Errorf("expected object, got %T", value)
		}
	}

	return nil
}

// validateEnumValue validates that a value is in the enum list
func (sg *SchemaGenerator) validateEnumValue(value interface{}, field *FieldInfo) error {
	valueStr := fmt.Sprintf("%v", value)
	for _, enumValue := range field.Enum {
		if fmt.Sprintf("%v", enumValue) == valueStr {
			return nil
		}
	}
	return fmt.Errorf("value '%s' not in allowed values: %v", valueStr, field.Enum)
}
