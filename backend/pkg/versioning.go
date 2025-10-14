package pkg

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

// VersionManager handles file versioning and backups
type VersionManager struct {
	basePath    string
	maxVersions int
}

// NewVersionManager creates a new version manager
func NewVersionManager(basePath string, maxVersions int) *VersionManager {
	return &VersionManager{
		basePath:    basePath,
		maxVersions: maxVersions,
	}
}

// CreateVersion creates a new version of the file
func (vm *VersionManager) CreateVersion(filePath string, data []map[string]any, format FileFormat) error {
	versionDir := filepath.Join(vm.basePath, "versions", filepath.Base(filePath))
	if err := os.MkdirAll(versionDir, 0755); err != nil {
		return fmt.Errorf("failed to create version directory: %w", err)
	}

	timestamp := time.Now().Format("20060102_150405")
	versionFile := filepath.Join(versionDir, fmt.Sprintf("%s_%s%s", strings.TrimSuffix(filepath.Base(filePath), filepath.Ext(filePath)), timestamp, format.Extension()))

	file, err := os.Create(versionFile)
	if err != nil {
		return fmt.Errorf("failed to create version file: %w", err)
	}
	defer file.Close()

	if err := format.Serialize(file, data); err != nil {
		os.Remove(versionFile)
		return fmt.Errorf("failed to serialize version data: %w", err)
	}

	// Clean up old versions
	return vm.cleanupOldVersions(versionDir)
}

// ListVersions returns all available versions for a file
func (vm *VersionManager) ListVersions(filePath string) ([]VersionInfo, error) {
	versionDir := filepath.Join(vm.basePath, "versions", filepath.Base(filePath))

	entries, err := os.ReadDir(versionDir)
	if err != nil {
		if os.IsNotExist(err) {
			return []VersionInfo{}, nil
		}
		return nil, err
	}

	var versions []VersionInfo
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), filepath.Ext(filePath)) {
			parts := strings.Split(strings.TrimSuffix(entry.Name(), filepath.Ext(entry.Name())), "_")
			if len(parts) >= 2 {
				timestamp, err := time.Parse("20060102_150405", parts[len(parts)-1])
				if err == nil {
					versions = append(versions, VersionInfo{
						FileName:  entry.Name(),
						Path:      filepath.Join(versionDir, entry.Name()),
						Timestamp: timestamp,
					})
				}
			}
		}
	}

	// Sort by timestamp (newest first)
	sort.Slice(versions, func(i, j int) bool {
		return versions[i].Timestamp.After(versions[j].Timestamp)
	})

	return versions, nil
}

// RestoreVersion restores a specific version
func (vm *VersionManager) RestoreVersion(versionPath, targetPath string, format FileFormat) error {
	file, err := os.Open(versionPath)
	if err != nil {
		return fmt.Errorf("failed to open version file: %w", err)
	}
	defer file.Close()

	data, err := format.Parse(file)
	if err != nil {
		return fmt.Errorf("failed to parse version data: %w", err)
	}

	// Write to target file
	targetFile, err := os.Create(targetPath)
	if err != nil {
		return fmt.Errorf("failed to create target file: %w", err)
	}
	defer targetFile.Close()

	return format.Serialize(targetFile, data)
}

// DeleteVersion deletes a specific version
func (vm *VersionManager) DeleteVersion(versionPath string) error {
	return os.Remove(versionPath)
}

// cleanupOldVersions removes versions beyond the maximum limit
func (vm *VersionManager) cleanupOldVersions(versionDir string) error {
	entries, err := os.ReadDir(versionDir)
	if err != nil {
		return err
	}

	if len(entries) <= vm.maxVersions {
		return nil
	}

	// Sort by modification time (oldest first)
	sort.Slice(entries, func(i, j int) bool {
		infoI, errI := entries[i].Info()
		infoJ, errJ := entries[j].Info()
		if errI != nil || errJ != nil {
			return false
		}
		return infoI.ModTime().Before(infoJ.ModTime())
	})

	// Remove oldest versions
	for i := 0; i < len(entries)-vm.maxVersions; i++ {
		os.Remove(filepath.Join(versionDir, entries[i].Name()))
	}

	return nil
}

// VersionInfo contains information about a version
type VersionInfo struct {
	FileName  string    `json:"fileName"`
	Path      string    `json:"path"`
	Timestamp time.Time `json:"timestamp"`
}

// BackupManager handles file backups
type BackupManager struct {
	backupDir string
}

// NewBackupManager creates a new backup manager
func NewBackupManager(backupDir string) *BackupManager {
	return &BackupManager{
		backupDir: backupDir,
	}
}

// CreateBackup creates a backup of the file
func (bm *BackupManager) CreateBackup(filePath string, data []map[string]any, format FileFormat) (string, error) {
	if err := os.MkdirAll(bm.backupDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create backup directory: %w", err)
	}

	timestamp := time.Now().Format("20060102_150405_000")
	backupFile := filepath.Join(bm.backupDir, fmt.Sprintf("%s_backup_%s%s",
		strings.TrimSuffix(filepath.Base(filePath), filepath.Ext(filePath)),
		timestamp,
		format.Extension()))

	file, err := os.Create(backupFile)
	if err != nil {
		return "", fmt.Errorf("failed to create backup file: %w", err)
	}
	defer file.Close()

	if err := format.Serialize(file, data); err != nil {
		os.Remove(backupFile)
		return "", fmt.Errorf("failed to serialize backup data: %w", err)
	}

	return backupFile, nil
}

// ListBackups returns all available backups
func (bm *BackupManager) ListBackups(filePath string) ([]BackupInfo, error) {
	pattern := filepath.Join(bm.backupDir, fmt.Sprintf("%s_backup_*%s",
		strings.TrimSuffix(filepath.Base(filePath), filepath.Ext(filePath)),
		filepath.Ext(filePath)))

	matches, err := filepath.Glob(pattern)
	if err != nil {
		return nil, err
	}

	var backups []BackupInfo
	for _, match := range matches {
		stat, err := os.Stat(match)
		if err != nil {
			continue
		}

		// Extract timestamp from filename
		base := strings.TrimSuffix(filepath.Base(match), filepath.Ext(match))
		parts := strings.Split(base, "_backup_")
		if len(parts) == 2 {
			timestamp, err := time.Parse("20060102_150405_000", parts[1])
			if err == nil {
				backups = append(backups, BackupInfo{
					FileName:  filepath.Base(match),
					Path:      match,
					Size:      stat.Size(),
					Timestamp: timestamp,
				})
			}
		}
	}

	// Sort by timestamp (newest first)
	sort.Slice(backups, func(i, j int) bool {
		return backups[i].Timestamp.After(backups[j].Timestamp)
	})

	return backups, nil
}

// RestoreBackup restores a backup
func (bm *BackupManager) RestoreBackup(backupPath, targetPath string, format FileFormat) error {
	return bm.restoreFromPath(backupPath, targetPath, format)
}

// DeleteBackup deletes a backup
func (bm *BackupManager) DeleteBackup(backupPath string) error {
	return os.Remove(backupPath)
}

// restoreFromPath is a helper method to restore from any path
func (bm *BackupManager) restoreFromPath(sourcePath, targetPath string, format FileFormat) error {
	file, err := os.Open(sourcePath)
	if err != nil {
		return fmt.Errorf("failed to open source file: %w", err)
	}
	defer file.Close()

	data, err := format.Parse(file)
	if err != nil {
		return fmt.Errorf("failed to parse source data: %w", err)
	}

	targetFile, err := os.Create(targetPath)
	if err != nil {
		return fmt.Errorf("failed to create target file: %w", err)
	}
	defer targetFile.Close()

	return format.Serialize(targetFile, data)
}

// BackupInfo contains information about a backup
type BackupInfo struct {
	FileName  string    `json:"fileName"`
	Path      string    `json:"path"`
	Size      int64     `json:"size"`
	Timestamp time.Time `json:"timestamp"`
}
