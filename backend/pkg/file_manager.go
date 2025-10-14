package pkg

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/oarkflow/jsonschema"
)

// FileManager handles generic file CRUD operations with thread safety
type FileManager struct {
	mu             sync.RWMutex
	filePath       string
	cache          []map[string]any
	lastMod        time.Time
	format         FileFormat
	registry       *FormatRegistry
	schema         *jsonschema.Schema
	versionManager *VersionManager
	backupManager  *BackupManager
}

// NewFileManager creates a new generic file manager instance
func NewFileManager(filePath string) (*FileManager, error) {
	return NewFileManagerWithFormat(filePath, nil)
}

// NewFileManagerWithFormat creates a new file manager with a specific format
func NewFileManagerWithFormat(filePath string, format FileFormat) (*FileManager, error) {
	return NewFileManagerWithOptions(filePath, format, nil, nil)
}

// NewFileManagerWithOptions creates a file manager with full options
func NewFileManagerWithOptions(filePath string, format FileFormat, versionManager *VersionManager, backupManager *BackupManager) (*FileManager, error) {
	absPath, err := filepath.Abs(filePath)
	if err != nil {
		return nil, fmt.Errorf("invalid file path: %w", err)
	}

	registry := NewFormatRegistry()

	// Auto-detect format from file extension if not provided
	if format == nil {
		ext := filepath.Ext(absPath)
		if ext == "" {
			ext = ".json" // Default to JSON
		}
		format, err = registry.Get(ext)
		if err != nil {
			return nil, fmt.Errorf("unsupported file format: %w", err)
		}
	}

	fm := &FileManager{
		filePath:       absPath,
		cache:          make([]map[string]any, 0),
		format:         format,
		registry:       registry,
		versionManager: versionManager,
		backupManager:  backupManager,
	}

	// Create file if it doesn't exist
	if _, err := os.Stat(absPath); os.IsNotExist(err) {
		if err := fm.initFile(); err != nil {
			return nil, err
		}
	}

	// Load initial data
	if err := fm.loadFromFileWithLock(false); err != nil {
		return nil, err
	}

	return fm, nil
}

// initFile creates an empty JSON file
func (fm *FileManager) initFile() error {
	dir := filepath.Dir(fm.filePath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	emptyData := []map[string]any{}
	return fm.writeToFile(emptyData)
}

// loadFromFile reads data from file into cache
func (fm *FileManager) loadFromFile() error {
	return fm.loadFromFileWithLock(true)
}

// loadFromFileWithLock reads data from file into cache with optional locking
func (fm *FileManager) loadFromFileWithLock(acquireLock bool) error {
	if acquireLock {
		fm.mu.Lock()
		defer fm.mu.Unlock()
	}

	file, err := os.Open(fm.filePath)
	if err != nil {
		return fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		return fmt.Errorf("failed to stat file: %w", err)
	}

	items, err := fm.format.Parse(file)
	if err != nil {
		return fmt.Errorf("failed to parse file: %w", err)
	}

	fm.cache = items
	fm.lastMod = stat.ModTime()
	return nil
}

// writeToFile writes data to file with atomic write
func (fm *FileManager) writeToFile(data []map[string]any) error {
	tmpFile := fm.filePath + ".tmp"

	// Write to temporary file
	file, err := os.Create(tmpFile)
	if err != nil {
		return fmt.Errorf("failed to create temp file: %w", err)
	}
	defer file.Close()

	if err := fm.format.Serialize(file, data); err != nil {
		os.Remove(tmpFile)
		return fmt.Errorf("failed to serialize data: %w", err)
	}

	file.Close()

	// Atomic rename
	if err := os.Rename(tmpFile, fm.filePath); err != nil {
		os.Remove(tmpFile) // Clean up temp file
		return fmt.Errorf("failed to rename file: %w", err)
	}

	return nil
}

// refreshCache reloads data if file was modified externally
func (fm *FileManager) refreshCache() error {
	stat, err := os.Stat(fm.filePath)
	if err != nil {
		return err
	}

	if stat.ModTime().After(fm.lastMod) {
		return fm.loadFromFileWithLock(false)
	}

	return nil
}

// deepCopy creates a deep copy of a map to prevent external modification
func deepCopy(src map[string]any) map[string]any {
	dst := make(map[string]any)
	for k, v := range src {
		switch val := v.(type) {
		case map[string]any:
			dst[k] = deepCopy(val)
		case []any:
			arr := make([]any, len(val))
			copy(arr, val)
			dst[k] = arr
		default:
			dst[k] = v
		}
	}
	return dst
}

// Create adds a new item
func (fm *FileManager) Create(item map[string]any) error {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	if err := fm.refreshCache(); err != nil {
		return err
	}

	// Validate if schema is set
	if fm.schema != nil {
		result := fm.schema.Validate(item)
		if !result.IsValid() {
			return fmt.Errorf("validation failed: %v", result.Errors)
		}
	}

	fm.cache = append(fm.cache, deepCopy(item))

	if err := fm.writeToFile(fm.cache); err != nil {
		return err
	}

	// Create backup and version after successful write
	if _, err := fm.CreateBackup(); err != nil {
		// Log error but don't fail the operation
		fmt.Printf("Warning: Failed to create backup: %v\n", err)
	}
	if err := fm.CreateVersion(); err != nil {
		// Log error but don't fail the operation
		fmt.Printf("Warning: Failed to create version: %v\n", err)
	}

	return fm.loadFromFileWithLock(false)
}

// CreateBatch adds multiple items at once (more efficient)
func (fm *FileManager) CreateBatch(items []map[string]any) error {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	if err := fm.refreshCache(); err != nil {
		return err
	}

	for _, item := range items {
		fm.cache = append(fm.cache, deepCopy(item))
	}

	if err := fm.writeToFile(fm.cache); err != nil {
		return err
	}

	return fm.loadFromFileWithLock(false)
}

// Read retrieves all items (thread-safe read from cache)
func (fm *FileManager) Read() ([]map[string]any, error) {
	fm.mu.RLock()
	defer fm.mu.RUnlock()

	if err := fm.refreshCache(); err != nil {
		return nil, err
	}

	// Return a deep copy to prevent external modification
	result := make([]map[string]any, len(fm.cache))
	for i, item := range fm.cache {
		result[i] = deepCopy(item)
	}
	return result, nil
}

// ReadOne retrieves a single item by index
func (fm *FileManager) ReadOne(index int) (map[string]any, error) {
	fm.mu.RLock()
	defer fm.mu.RUnlock()

	if err := fm.refreshCache(); err != nil {
		return nil, err
	}

	if index < 0 || index >= len(fm.cache) {
		return nil, errors.New("index out of bounds")
	}

	return deepCopy(fm.cache[index]), nil
}

// FindBy retrieves items matching a predicate function
func (fm *FileManager) FindBy(predicate func(map[string]any) bool) ([]map[string]any, error) {
	fm.mu.RLock()
	defer fm.mu.RUnlock()

	if err := fm.refreshCache(); err != nil {
		return nil, err
	}

	results := make([]map[string]any, 0)
	for _, item := range fm.cache {
		if predicate(item) {
			results = append(results, deepCopy(item))
		}
	}

	return results, nil
}

// FindOneBy retrieves the first item matching a predicate function
func (fm *FileManager) FindOneBy(predicate func(map[string]any) bool) (map[string]any, int, error) {
	fm.mu.RLock()
	defer fm.mu.RUnlock()

	if err := fm.refreshCache(); err != nil {
		return nil, -1, err
	}

	for i, item := range fm.cache {
		if predicate(item) {
			return deepCopy(item), i, nil
		}
	}

	return nil, -1, errors.New("item not found")
}

// FindByField retrieves items where a field matches a value (convenience method)
func (fm *FileManager) FindByField(field string, value any) ([]map[string]any, error) {
	return fm.FindBy(func(item map[string]any) bool {
		return item[field] == value
	})
}

// FindOneByField retrieves the first item where a field matches a value
func (fm *FileManager) FindOneByField(field string, value any) (map[string]any, int, error) {
	return fm.FindOneBy(func(item map[string]any) bool {
		return item[field] == value
	})
}

// Update modifies an item at a specific index
func (fm *FileManager) Update(index int, updatedItem map[string]any) error {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	if err := fm.refreshCache(); err != nil {
		return err
	}

	if index < 0 || index >= len(fm.cache) {
		return errors.New("index out of bounds")
	}

	// Validate if schema is set
	if fm.schema != nil {
		result := fm.schema.Validate(updatedItem)
		if !result.IsValid() {
			return fmt.Errorf("validation failed: %v", result.Errors)
		}
	}

	fm.cache[index] = deepCopy(updatedItem)

	if err := fm.writeToFile(fm.cache); err != nil {
		return err
	}

	// Create backup and version after successful write
	if _, err := fm.CreateBackup(); err != nil {
		// Log error but don't fail the operation
		fmt.Printf("Warning: Failed to create backup: %v\n", err)
	}
	if err := fm.CreateVersion(); err != nil {
		// Log error but don't fail the operation
		fmt.Printf("Warning: Failed to create version: %v\n", err)
	}

	return fm.loadFromFileWithLock(false)
}

// UpdateBy updates items matching a predicate function
func (fm *FileManager) UpdateBy(predicate func(map[string]any) bool, updateFn func(map[string]any) map[string]any) (int, error) {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	if err := fm.refreshCache(); err != nil {
		return 0, err
	}

	count := 0
	for i, item := range fm.cache {
		if predicate(item) {
			fm.cache[i] = deepCopy(updateFn(item))
			count++
		}
	}

	if count == 0 {
		return 0, errors.New("no items matched")
	}

	if err := fm.writeToFile(fm.cache); err != nil {
		return 0, err
	}

	if err := fm.loadFromFileWithLock(false); err != nil {
		return 0, err
	}

	return count, nil
}

// UpdateByField updates items where a field matches a value (convenience method)
func (fm *FileManager) UpdateByField(field string, value any, updateFn func(map[string]any) map[string]any) (int, error) {
	return fm.UpdateBy(func(item map[string]any) bool {
		return item[field] == value
	}, updateFn)
}

// Patch partially updates an item by merging fields
func (fm *FileManager) Patch(index int, updates map[string]any) error {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	if err := fm.refreshCache(); err != nil {
		return err
	}

	if index < 0 || index >= len(fm.cache) {
		return errors.New("index out of bounds")
	}

	// Merge updates into existing item
	for k, v := range updates {
		fm.cache[index][k] = v
	}

	if err := fm.writeToFile(fm.cache); err != nil {
		return err
	}

	return fm.loadFromFileWithLock(false)
}

// PatchBy partially updates items matching a predicate
func (fm *FileManager) PatchBy(predicate func(map[string]any) bool, updates map[string]any) (int, error) {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	if err := fm.refreshCache(); err != nil {
		return 0, err
	}

	count := 0
	for i, item := range fm.cache {
		if predicate(item) {
			for k, v := range updates {
				fm.cache[i][k] = v
			}
			count++
		}
	}

	if count == 0 {
		return 0, errors.New("no items matched")
	}

	if err := fm.writeToFile(fm.cache); err != nil {
		return 0, err
	}

	if err := fm.loadFromFileWithLock(false); err != nil {
		return 0, err
	}

	return count, nil
}

// Delete removes an item by index
func (fm *FileManager) Delete(index int) error {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	if err := fm.refreshCache(); err != nil {
		return err
	}

	if index < 0 || index >= len(fm.cache) {
		return errors.New("index out of bounds")
	}

	fm.cache = append(fm.cache[:index], fm.cache[index+1:]...)

	if err := fm.writeToFile(fm.cache); err != nil {
		return err
	}

	// Create backup and version after successful write
	if _, err := fm.CreateBackup(); err != nil {
		// Log error but don't fail the operation
		fmt.Printf("Warning: Failed to create backup: %v\n", err)
	}
	if err := fm.CreateVersion(); err != nil {
		// Log error but don't fail the operation
		fmt.Printf("Warning: Failed to create version: %v\n", err)
	}

	return fm.loadFromFileWithLock(false)
}

// DeleteBy removes items matching a predicate function
func (fm *FileManager) DeleteBy(predicate func(map[string]any) bool) (int, error) {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	if err := fm.refreshCache(); err != nil {
		return 0, err
	}

	newCache := make([]map[string]any, 0, len(fm.cache))
	count := 0
	for _, item := range fm.cache {
		if !predicate(item) {
			newCache = append(newCache, item)
		} else {
			count++
		}
	}

	if count == 0 {
		return 0, errors.New("no items matched")
	}

	fm.cache = newCache

	if err := fm.writeToFile(fm.cache); err != nil {
		return 0, err
	}

	if err := fm.loadFromFileWithLock(false); err != nil {
		return 0, err
	}

	return count, nil
}

// DeleteByField removes items where a field matches a value
func (fm *FileManager) DeleteByField(field string, value any) (int, error) {
	return fm.DeleteBy(func(item map[string]any) bool {
		return item[field] == value
	})
}

// Count returns the number of items
func (fm *FileManager) Count() (int, error) {
	fm.mu.RLock()
	defer fm.mu.RUnlock()

	if err := fm.refreshCache(); err != nil {
		return 0, err
	}

	return len(fm.cache), nil
}

// Clear removes all items
func (fm *FileManager) Clear() error {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	fm.cache = []map[string]any{}

	if err := fm.writeToFile(fm.cache); err != nil {
		return err
	}

	return fm.loadFromFileWithLock(false)
}

// Replace replaces all items with a new set
func (fm *FileManager) Replace(items []map[string]any) error {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	newCache := make([]map[string]any, len(items))
	for i, item := range items {
		newCache[i] = deepCopy(item)
	}

	fm.cache = newCache

	if err := fm.writeToFile(fm.cache); err != nil {
		return err
	}

	return fm.loadFromFileWithLock(false)
}

// GetFormat returns the current file format
func (fm *FileManager) GetFormat() FileFormat {
	return fm.format
}

// SetFormat changes the file format (requires saving data)
func (fm *FileManager) SetFormat(format FileFormat) error {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	fm.format = format
	return fm.writeToFile(fm.cache)
}

// SetVersionManager sets the version manager
func (fm *FileManager) SetVersionManager(vm *VersionManager) {
	fm.versionManager = vm
}

// SetBackupManager sets the backup manager
func (fm *FileManager) SetBackupManager(bm *BackupManager) {
	fm.backupManager = bm
}

// CreateVersion creates a version of the current data
func (fm *FileManager) CreateVersion() error {
	if fm.versionManager == nil {
		return errors.New("version manager not set")
	}

	fm.mu.RLock()
	defer fm.mu.RUnlock()

	return fm.versionManager.CreateVersion(fm.filePath, fm.cache, fm.format)
}

// CreateBackup creates a backup of the current data
func (fm *FileManager) CreateBackup() (string, error) {
	if fm.backupManager == nil {
		return "", errors.New("backup manager not set")
	}

	fm.mu.RLock()
	defer fm.mu.RUnlock()

	return fm.backupManager.CreateBackup(fm.filePath, fm.cache, fm.format)
}

// ListVersions returns all versions
func (fm *FileManager) ListVersions() ([]VersionInfo, error) {
	if fm.versionManager == nil {
		return nil, errors.New("version manager not set")
	}

	return fm.versionManager.ListVersions(fm.filePath)
}

// RestoreVersion restores a specific version
func (fm *FileManager) RestoreVersion(versionPath string) error {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	if fm.versionManager == nil {
		return errors.New("version manager not set")
	}

	if err := fm.versionManager.RestoreVersion(versionPath, fm.filePath, fm.format); err != nil {
		return err
	}

	return fm.loadFromFileWithLock(false)
}

// ListBackups returns all backups
func (fm *FileManager) ListBackups() ([]BackupInfo, error) {
	if fm.backupManager == nil {
		return nil, errors.New("backup manager not set")
	}

	return fm.backupManager.ListBackups(fm.filePath)
}

// RestoreBackup restores a specific backup
func (fm *FileManager) RestoreBackup(backupPath string) error {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	if fm.backupManager == nil {
		return errors.New("backup manager not set")
	}

	if err := fm.backupManager.RestoreBackup(backupPath, fm.filePath, fm.format); err != nil {
		return err
	}

	return fm.loadFromFileWithLock(false)
}

// SetSchema sets a validation schema for the file manager
func (fm *FileManager) SetSchema(schema *jsonschema.Schema) {
	fm.schema = schema
}

// GetSchema returns the current schema
func (fm *FileManager) GetSchema() *jsonschema.Schema {
	return fm.schema
}

// ValidateData validates all cached data against the schema
func (fm *FileManager) ValidateData() []error {
	fm.mu.RLock()
	defer fm.mu.RUnlock()

	if fm.schema == nil {
		return nil
	}

	var allErrors []error
	for i, item := range fm.cache {
		result := fm.schema.Validate(item)
		if !result.IsValid() {
			for _, err := range result.Errors {
				// Add item index to error message
				allErrors = append(allErrors, fmt.Errorf("item %d: %v", i, err))
			}
		}
	}
	return allErrors
}

// Remove SanitizeData since jsonschema doesn't provide sanitization

// ConvertFormat converts the file to a new format
func (fm *FileManager) ConvertFormat(newFormat FileFormat, newFilePath string) error {
	fm.mu.RLock()
	data := make([]map[string]any, len(fm.cache))
	for i, item := range fm.cache {
		data[i] = deepCopy(item)
	}
	fm.mu.RUnlock()

	// Create new file manager with new format
	newFM, err := NewFileManagerWithFormat(newFilePath, newFormat)
	if err != nil {
		return err
	}

	return newFM.Replace(data)
}

// Search performs a text search across all fields
func (fm *FileManager) Search(query string, caseSensitive bool) ([]map[string]any, error) {
	fm.mu.RLock()
	defer fm.mu.RUnlock()

	if err := fm.refreshCache(); err != nil {
		return nil, err
	}

	var results []map[string]any
	queryStr := query
	if !caseSensitive {
		queryStr = strings.ToLower(query)
	}

	for _, item := range fm.cache {
		matches := false
		for _, value := range item {
			valueStr := fmt.Sprintf("%v", value)
			if !caseSensitive {
				valueStr = strings.ToLower(valueStr)
			}
			if strings.Contains(valueStr, queryStr) {
				matches = true
				break
			}
		}
		if matches {
			results = append(results, deepCopy(item))
		}
	}

	return results, nil
}

// Sort sorts items by a field
func (fm *FileManager) Sort(field string, ascending bool) error {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	if err := fm.refreshCache(); err != nil {
		return err
	}

	// Simple sort implementation
	for i := 0; i < len(fm.cache)-1; i++ {
		for j := i + 1; j < len(fm.cache); j++ {
			compare := compareValues(fm.cache[i][field], fm.cache[j][field])
			if (ascending && compare > 0) || (!ascending && compare < 0) {
				fm.cache[i], fm.cache[j] = fm.cache[j], fm.cache[i]
			}
		}
	}

	return fm.writeToFile(fm.cache)
}

// Filter applies a filter function and returns matching items
func (fm *FileManager) Filter(predicate func(map[string]any) bool) ([]map[string]any, error) {
	return fm.FindBy(predicate)
}

// Paginate returns a page of items
func (fm *FileManager) Paginate(page, pageSize int) ([]map[string]any, int, error) {
	fm.mu.RLock()
	defer fm.mu.RUnlock()

	if err := fm.refreshCache(); err != nil {
		return nil, 0, err
	}

	total := len(fm.cache)
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	start := (page - 1) * pageSize
	if start >= total {
		return []map[string]any{}, total, nil
	}

	end := start + pageSize
	if end > total {
		end = total
	}

	result := make([]map[string]any, end-start)
	for i := start; i < end; i++ {
		result[i-start] = deepCopy(fm.cache[i])
	}

	return result, total, nil
}

// Backup creates a backup of the current file
func (fm *FileManager) Backup(backupPath string) error {
	fm.mu.RLock()
	defer fm.mu.RUnlock()

	if err := fm.refreshCache(); err != nil {
		return err
	}

	return fm.writeToFileWithPath(backupPath, fm.cache)
}

// writeToFileWithPath writes data to a specific path
func (fm *FileManager) writeToFileWithPath(filePath string, data []map[string]any) error {
	tmpFile := filePath + ".tmp"

	file, err := os.Create(tmpFile)
	if err != nil {
		return fmt.Errorf("failed to create temp file: %w", err)
	}
	defer file.Close()

	if err := fm.format.Serialize(file, data); err != nil {
		os.Remove(tmpFile)
		return fmt.Errorf("failed to serialize data: %w", err)
	}

	file.Close()

	if err := os.Rename(tmpFile, filePath); err != nil {
		os.Remove(tmpFile)
		return fmt.Errorf("failed to rename file: %w", err)
	}

	return nil
}

// Validate checks data against a validation function
func (fm *FileManager) Validate(validator func(map[string]any) error) []error {
	fm.mu.RLock()
	defer fm.mu.RUnlock()

	var errs []error
	for i, item := range fm.cache {
		if err := validator(item); err != nil {
			errs = append(errs, fmt.Errorf("item %d: %w", i, err))
		}
	}

	return errs
}

// GetStatistics returns basic statistics about the data
func (fm *FileManager) GetStatistics() (map[string]any, error) {
	fm.mu.RLock()
	defer fm.mu.RUnlock()

	if err := fm.refreshCache(); err != nil {
		return nil, err
	}

	stats := map[string]any{
		"totalItems": len(fm.cache),
		"fields":     make(map[string]int),
	}

	fieldCounts := stats["fields"].(map[string]int)
	for _, item := range fm.cache {
		for field := range item {
			fieldCounts[field]++
		}
	}

	return stats, nil
}

// compareValues compares two values for sorting
func compareValues(a, b any) int {
	aStr := fmt.Sprintf("%v", a)
	bStr := fmt.Sprintf("%v", b)
	return strings.Compare(aStr, bStr)
}

// GetFields returns all unique field names across all items
func (fm *FileManager) GetFields() ([]string, error) {
	fm.mu.RLock()
	defer fm.mu.RUnlock()

	if err := fm.refreshCache(); err != nil {
		return nil, err
	}

	fieldSet := make(map[string]bool)
	for _, item := range fm.cache {
		for field := range item {
			fieldSet[field] = true
		}
	}

	fields := make([]string, 0, len(fieldSet))
	for field := range fieldSet {
		fields = append(fields, field)
	}

	return fields, nil
}

// GetSupportedFormats returns all supported file extensions
func (fm *FileManager) GetSupportedFormats() []string {
	return fm.registry.SupportedExtensions()
}
