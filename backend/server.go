package main

import (
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"golang.org/x/crypto/bcrypt"

	"backend/pkg"
)

type Server struct {
	app                *fiber.App
	fileManager        *pkg.FileManager
	dataDir            string
	restrictFiles      []string
	users              []User
	schemaGenerator    *pkg.SchemaGenerator
	dynamicTemplateGen *pkg.DynamicTemplateGenerator
	metadataExtractor  *pkg.MetadataExtractor
	fileSchemas        map[string]*pkg.SchemaInfo // Cache for file schemas
}

type User struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Email        string `json:"email"`
	Password     string `json:"password,omitempty"` // Hashed password
	Age          int    `json:"age"`
	Active       bool   `json:"active"`
	LastModified string `json:"lastModified,omitempty"`
}

type FileInfo struct {
	Name      string
	Path      string
	Format    string
	Size      int64
	Modified  string
	ItemCount int
	Fields    []string
}

func NewServer(dataDir string, restrictFiles ...string) *Server {
	// Create Fiber app
	app := fiber.New()

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New())

	server := &Server{
		app:                app,
		dataDir:            dataDir,
		restrictFiles:      restrictFiles,
		schemaGenerator:    pkg.NewSchemaGenerator(),
		dynamicTemplateGen: pkg.NewDynamicTemplateGenerator(),
		metadataExtractor:  pkg.NewMetadataExtractor(),
		fileSchemas:        make(map[string]*pkg.SchemaInfo),
	}

	// Load users for authentication
	if err := server.loadUsers(); err != nil {
		log.Printf("Warning: Failed to load users: %v", err)
	}
	app.Static("/", "./dist", fiber.Static{
		Index:    "index.html",
		Compress: true,
		Browse:   true,
	})
	server.publicRoutes()
	server.setupRoutes()
	return server
}

// loadUsers loads user data from users.json file
func (s *Server) loadUsers() error {
	userFilePath := filepath.Join(s.dataDir, "users.json")
	fm, err := pkg.NewFileManager(userFilePath)
	if err != nil {
		return fmt.Errorf("failed to create user file manager: %w", err)
	}

	usersData, err := fm.Read()
	if err != nil {
		return fmt.Errorf("failed to read users: %w", err)
	}

	s.users = make([]User, 0, len(usersData))
	for _, userData := range usersData {
		user := User{
			ID:     fmt.Sprintf("%v", userData["id"]),
			Name:   fmt.Sprintf("%v", userData["name"]),
			Email:  fmt.Sprintf("%v", userData["email"]),
			Active: userData["active"] == true,
		}
		if age, ok := userData["age"].(float64); ok {
			user.Age = int(age)
		}
		if lastMod, ok := userData["lastModified"].(string); ok {
			user.LastModified = lastMod
		}

		// Handle password - if not present, use default and hash it
		if password, ok := userData["password"].(string); ok && password != "" {
			// If password is already hashed (bcrypt format), use it
			if strings.HasPrefix(password, "$2a$") || strings.HasPrefix(password, "$2b$") || strings.HasPrefix(password, "$2y$") {
				user.Password = password
			} else {
				// Plain text password, hash it
				hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
				if err != nil {
					log.Printf("Warning: Failed to hash password for user %s: %v", user.Email, err)
					continue
				}
				user.Password = string(hashedPassword)
			}
		} else {
			// No password set, use default password "password123" and hash it
			defaultPassword := "password123"
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
			if err != nil {
				log.Printf("Warning: Failed to hash default password for user %s: %v", user.Email, err)
				continue
			}
			user.Password = string(hashedPassword)
		}

		if user.Active {
			s.users = append(s.users, user)
		}
	}

	return nil
}

// authenticateUser validates user credentials
func (s *Server) authenticateUser(email, password string) (*User, bool) {
	for _, user := range s.users {
		if user.Email == email && user.Active {
			// Verify hashed password
			err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
			if err == nil {
				return &user, true
			}
		}
	}
	return nil, false
}

// basicAuthMiddleware provides HTTP Basic Authentication
func (s *Server) basicAuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		auth := c.Get("Authorization")
		if auth == "" {
			return s.unauthorized(c)
		}

		if !strings.HasPrefix(auth, "Basic ") {
			return s.unauthorized(c)
		}

		encodedCredentials := strings.TrimPrefix(auth, "Basic ")
		decodedCredentials, err := base64.StdEncoding.DecodeString(encodedCredentials)
		if err != nil {
			return s.unauthorized(c)
		}

		credentials := string(decodedCredentials)
		parts := strings.SplitN(credentials, ":", 2)
		if len(parts) != 2 {
			return s.unauthorized(c)
		}

		username, password := parts[0], parts[1]
		user, authenticated := s.authenticateUser(username, password)
		if !authenticated {
			return s.unauthorized(c)
		}

		// Store user in context for later use
		c.Locals("user", user)
		return c.Next()
	}
}

// unauthorized sends a 401 Unauthorized response
func (s *Server) unauthorized(c *fiber.Ctx) error {
	c.Set("WWW-Authenticate", `Basic realm="File Manager"`)
	return c.Status(401).JSON(fiber.Map{
		"error": "Authentication required",
	})
}

func (s *Server) publicRoutes() {
	s.app.Get("/get/:filename", s.handleGetFileContent)
	s.app.Get("/api/userinfo", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"data": fiber.Map{
				"name": "Guest User",
			},
		})
	})
}

func (s *Server) setupRoutes() {
	// Apply authentication middleware to all routes except public ones
	s.app.Use(s.basicAuthMiddleware())

	// Main routes
	s.app.Get("/files", s.handleHome)
	s.app.Get("/files/:filename", s.handleFileView)
	s.app.Get("/files/:filename/create", s.handleCreateForm)
	s.app.Get("/files/:filename/edit/:id", s.handleEditForm)
	s.app.Get("/files/:filename/search", s.handleSearch)

	// API routes
	s.app.Get("/api/files", s.handleListFiles)
	s.app.Post("/api/files/:filename/items", s.handleCreateItem)
	s.app.Get("/api/files/:filename/items/:id", s.handleGetItem)
	s.app.Post("/api/files/:filename/items/:id", s.handleUpdateItem)
	s.app.Delete("/api/files/:filename/items/:id", s.handleDeleteItem)
	s.app.Get("/api/files/:filename/items", s.handleListItems)
	s.app.Get("/api/files/:filename/fields", s.handleGetFields)
	s.app.Get("/api/files/:filename/metadata", s.handleGetMetadata)
	s.app.Get("/api/files/:filename/structure", s.handleGetStructure)
	s.app.Get("/api/files/:filename/info", s.handleGetFileInfo)
}

func (s *Server) handleHome(c *fiber.Ctx) error {
	c.Set("Content-Type", "text/html")
	return c.SendFile("templates/index.html")
}

func (s *Server) handleFileView(c *fiber.Ctx) error {
	c.Set("Content-Type", "text/html")
	return c.SendFile("templates/file_view.html")
}

func (s *Server) handleCreateForm(c *fiber.Ctx) error {
	c.Set("Content-Type", "text/html")
	return c.SendFile("templates/item_form.html")
}

func (s *Server) handleEditForm(c *fiber.Ctx) error {
	c.Set("Content-Type", "text/html")
	return c.SendFile("templates/item_form.html")
}

func (s *Server) handleSearch(c *fiber.Ctx) error {
	filename := c.Params("filename")
	query := c.Query("q", "")

	fm, err := s.initFileManager(filename)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	results, err := fm.Search(query, false)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"results": results})
}

func (s *Server) handleGetFileContent(c *fiber.Ctx) error {
	filename := c.Params("filename")
	for _, file := range s.restrictFiles {
		if strings.Contains(filename, file) {
			return c.Redirect("/")
		}
	}
	filePath := filepath.Join(s.dataDir, filename)
	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return c.Status(404).JSON(fiber.Map{"error": "File not found"})
	}

	// Read file content
	content, err := os.ReadFile(filePath)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to read file"})
	}

	// Set appropriate content type based on file extension
	ext := strings.ToLower(filepath.Ext(filename))
	var contentType string
	switch ext {
	case ".json":
		contentType = "application/json"
	case ".yaml", ".yml":
		contentType = "application/yaml"
	case ".csv":
		contentType = "text/csv"
	case ".xml":
		contentType = "application/xml"
	default:
		contentType = "text/plain"
	}

	c.Set("Content-Type", contentType)
	return c.Send(content)
}

func (s *Server) handleGetItem(c *fiber.Ctx) error {
	filename := c.Params("filename")
	id := c.Params("id")

	fm, err := s.initFileManager(filename)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	// Get schema for primary key
	schema, err := s.getFileSchema(filename)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	// Find item by primary key
	items, err := fm.Read()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	// For menu.json, search in flattened structure
	if filename == "menu.json" {
		for _, section := range items {
			if sectionItems, ok := section["items"].([]interface{}); ok {
				for _, it := range sectionItems {
					if itemMap, ok := it.(map[string]interface{}); ok {
						// Use "id" as primary key for menu.json items
						if fmt.Sprintf("%v", itemMap["id"]) == id {
							// Add section info to the item
							itemMap["_section_title"] = section["title"]
							itemMap["_section_image"] = section["image"]
							itemMap["_section_subtitle"] = section["subtitle"]
							return c.JSON(itemMap)
						}
					}
				}
			}
		}
	} else {
		// For other files, direct lookup
		for _, item := range items {
			if fmt.Sprintf("%v", item[schema.PrimaryKey]) == id {
				return c.JSON(item)
			}
		}
	}

	return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
}

func (s *Server) handleCreateItem(c *fiber.Ctx) error {
	filename := c.Params("filename")

	// Parse JSON body
	var item map[string]any
	if err := c.BodyParser(&item); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON data"})
	}

	fm, err := s.initFileManager(filename)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	// For menu.json, we need to add the item to the appropriate section
	if filename == "menu.json" {
		// Get section info from the item (should be included in the data)
		sectionTitle := ""
		if title, ok := item["_section_title"].(string); ok {
			sectionTitle = title
			delete(item, "_section_title") // Remove metadata before saving
			delete(item, "_section_image")
			delete(item, "_section_subtitle")
		}

		if sectionTitle == "" {
			// Default to first section if no section specified
			items, err := fm.Read()
			if err != nil {
				return c.Status(500).JSON(fiber.Map{"error": err.Error()})
			}
			if len(items) > 0 {
				sectionTitle = items[0]["title"].(string)
			}
		}

		// Find the section and add the item
		items, err := fm.Read()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}

		for i, section := range items {
			if section["title"] == sectionTitle {
				if sectionItems, ok := section["items"].([]interface{}); ok {
					sectionItems = append(sectionItems, item)
					section["items"] = sectionItems
					items[i] = section

					if err := fm.Save(items); err != nil {
						return c.Status(500).JSON(fiber.Map{"error": err.Error()})
					}

					return c.JSON(fiber.Map{"success": true, "message": "Item created"})
				}
			}
		}

		return c.Status(400).JSON(fiber.Map{"error": "Section not found"})
	}

	// For other files, create directly
	if err := fm.Create(item); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"success": true, "message": "Item created"})
}

func (s *Server) handleUpdateItem(c *fiber.Ctx) error {
	filename := c.Params("filename")
	id := c.Params("id")

	// Parse JSON body
	var updatedItem map[string]any
	if err := c.BodyParser(&updatedItem); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON data"})
	}

	fm, err := s.initFileManager(filename)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	// Get schema for primary key detection
	schema, err := s.getFileSchema(filename)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	// Handle nested structure for menu.json
	if filename == "menu.json" {
		items, err := fm.Read()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}

		updated := false
		for i, section := range items {
			if sectionItems, ok := section["items"].([]interface{}); ok {
				for j, it := range sectionItems {
					if itemMap, ok := it.(map[string]interface{}); ok {
						// Use "id" as primary key for menu.json items
						if fmt.Sprintf("%v", itemMap["id"]) == id {
							// Update the item with new data
							for k, v := range updatedItem {
								if !strings.HasPrefix(k, "_section_") { // Skip section metadata
									itemMap[k] = v
								}
							}

							// Update the section's items array
							sectionItems[j] = itemMap
							section["items"] = sectionItems
							items[i] = section

							// Save the entire structure
							if err := fm.Save(items); err != nil {
								return c.Status(500).JSON(fiber.Map{"error": err.Error()})
							}

							updated = true
							break
						}
					}
				}
				if updated {
					break
				}
			}
		}

		if !updated {
			return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
		}

		return c.JSON(fiber.Map{"success": true, "message": "Item updated"})
	}

	// For other files, use the original logic
	items, err := fm.Read()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	for i, item := range items {
		if fmt.Sprintf("%v", item[schema.PrimaryKey]) == id {
			// Update the item
			for k, v := range updatedItem {
				item[k] = v
			}
			items[i] = item

			if err := fm.Save(items); err != nil {
				return c.Status(500).JSON(fiber.Map{"error": err.Error()})
			}

			return c.JSON(fiber.Map{"success": true, "message": "Item updated"})
		}
	}

	return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
}

func (s *Server) handleDeleteItem(c *fiber.Ctx) error {
	filename := c.Params("filename")
	id := c.Params("id")

	fm, err := s.initFileManager(filename)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	// Handle nested structure for menu.json
	if filename == "menu.json" {
		items, err := fm.Read()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}

		for i, section := range items {
			if sectionItems, ok := section["items"].([]interface{}); ok {
				for j, it := range sectionItems {
					if itemMap, ok := it.(map[string]interface{}); ok {
						if fmt.Sprintf("%v", itemMap["id"]) == id {
							// Remove the item from the section
							sectionItems = append(sectionItems[:j], sectionItems[j+1:]...)
							section["items"] = sectionItems
							items[i] = section

							// Save the entire structure
							if err := fm.Save(items); err != nil {
								return c.Status(500).JSON(fiber.Map{"error": err.Error()})
							}

							return c.JSON(fiber.Map{"success": true, "message": "Item deleted"})
						}
					}
				}
			}
		}

		return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
	}

	// For other files, use the original logic
	items, _ := fm.Read()
	for i, it := range items {
		if fmt.Sprintf("%v", it["id"]) == id {
			if err := fm.Delete(i); err != nil {
				return c.Status(500).JSON(fiber.Map{"error": err.Error()})
			}
			return c.JSON(fiber.Map{"success": true, "message": "Item deleted"})
		}
	}

	return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
}

func (s *Server) handleListFiles(c *fiber.Ctx) error {
	files, err := ioutil.ReadDir(s.dataDir)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	var fileList []FileInfo
	for _, file := range files {
		if !file.IsDir() {
			// Skip restricted files
			restricted := false
			for _, restrictFile := range s.restrictFiles {
				if strings.Contains(file.Name(), restrictFile) {
					restricted = true
					break
				}
			}
			if restricted {
				continue
			}

			// Get file info
			filePath := filepath.Join(s.dataDir, file.Name())
			fileStat, err := os.Stat(filePath)
			size := int64(0)
			modified := ""
			if err == nil {
				size = fileStat.Size()
				modified = fileStat.ModTime().Format("2006-01-02 15:04:05")
			}

			// Get item count
			fm, err := s.initFileManager(file.Name())
			itemCount := 0
			if err == nil {
				itemCount, _ = fm.Count()
			}

			fileInfo := FileInfo{
				Name:      file.Name(),
				Path:      filePath,
				Format:    strings.TrimPrefix(filepath.Ext(file.Name()), "."),
				Size:      size,
				Modified:  modified,
				ItemCount: itemCount,
				Fields:    []string{}, // Will be populated when needed
			}
			fileList = append(fileList, fileInfo)
		}
	}

	return c.JSON(fiber.Map{"files": fileList})
}

func (s *Server) handleListItems(c *fiber.Ctx) error {
	filename := c.Params("filename")
	page := c.QueryInt("page", 1)
	pageSize := c.QueryInt("pageSize", 10)
	search := c.Query("search", "")

	fm, err := s.initFileManager(filename)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	var items []map[string]any
	if search != "" {
		items, err = fm.Search(search, false)
	} else {
		items, err = fm.Read()
	}
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	// Flatten nested items for menu.json structure
	if filename == "menu.json" {
		var flattenedItems []map[string]any
		for _, section := range items {
			if sectionItems, ok := section["items"].([]interface{}); ok {
				// Add section info to each item
				for _, item := range sectionItems {
					if itemMap, ok := item.(map[string]interface{}); ok {
						// Create a flattened item with section info
						flattenedItem := make(map[string]any)
						for k, v := range itemMap {
							flattenedItem[k] = v
						}
						// Add section metadata
						flattenedItem["_section_title"] = section["title"]
						flattenedItem["_section_image"] = section["image"]
						flattenedItem["_section_subtitle"] = section["subtitle"]
						flattenedItems = append(flattenedItems, flattenedItem)
					}
				}
			} else {
				// If no nested items, treat section as item
				flattenedItems = append(flattenedItems, section)
			}
		}
		items = flattenedItems
	}

	// Pagination
	totalItems := len(items)
	totalPages := (totalItems + pageSize - 1) / pageSize
	start := (page - 1) * pageSize
	end := start + pageSize
	if end > totalItems {
		end = totalItems
	}
	if start < totalItems {
		items = items[start:end]
	} else {
		items = []map[string]any{}
	}

	// Get fields from the actual items (not schema) for proper display
	var itemFields []string
	if len(items) > 0 {
		// Collect all unique field names from the items
		fieldMap := make(map[string]bool)
		for _, item := range items {
			for key := range item {
				if !strings.HasPrefix(key, "_section_") { // Skip section metadata
					fieldMap[key] = true
				}
			}
		}
		for field := range fieldMap {
			itemFields = append(itemFields, field)
		}
		// Sort for consistent ordering
		sort.Strings(itemFields)
	}

	return c.JSON(fiber.Map{
		"items":      items,
		"page":       page,
		"totalPages": totalPages,
		"totalItems": totalItems,
		"fields":     itemFields,
	})
}

func (s *Server) handleGetFields(c *fiber.Ctx) error {
	filename := c.Params("filename")

	fm, err := s.initFileManager(filename)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	fields, err := fm.GetFields()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"fields": fields})
}

func (s *Server) handleGetMetadata(c *fiber.Ctx) error {
	filename := c.Params("filename")
	filePath := filepath.Join(s.dataDir, filename)

	metadata, err := s.metadataExtractor.ExtractMetadata(filePath)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"success":  true,
		"metadata": metadata,
	})
}

func (s *Server) handleGetStructure(c *fiber.Ctx) error {
	filename := c.Params("filename")
	filePath := filepath.Join(s.dataDir, filename)

	structure, err := s.metadataExtractor.GetFileStructure(filePath)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"success":   true,
		"structure": structure,
	})
}

func (s *Server) handleGetFileInfo(c *fiber.Ctx) error {
	filename := c.Params("filename")

	// Get file stats
	filePath := filepath.Join(s.dataDir, filename)
	fileStat, err := os.Stat(filePath)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "File not found"})
	}

	// Get item count
	fm, err := s.initFileManager(filename)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	count, _ := fm.Count()

	// Get schema for field count
	schema, err := s.getFileSchema(filename)
	fieldCount := 0
	if err == nil && schema != nil {
		fieldCount = len(schema.Fields)
	}

	return c.JSON(fiber.Map{
		"name":       filename,
		"format":     strings.TrimPrefix(filepath.Ext(filename), "."),
		"size":       fileStat.Size(),
		"modified":   fileStat.ModTime().Format("2006-01-02 15:04:05"),
		"itemCount":  count,
		"fieldCount": fieldCount,
	})
}

// getFileSchema gets or generates schema for a file
func (s *Server) getFileSchema(filename string) (*pkg.SchemaInfo, error) {
	// Check cache first
	if schema, exists := s.fileSchemas[filename]; exists {
		return schema, nil
	}

	// Generate schema from file
	filePath := filepath.Join(s.dataDir, filename)
	schema, err := s.schemaGenerator.GenerateSchemaFromFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to generate schema: %w", err)
	}

	// Cache the schema
	s.fileSchemas[filename] = schema
	return schema, nil
}

// convertFormValue converts form string value to appropriate type based on field info
func (s *Server) convertFormValue(value string, field *pkg.FieldInfo) (interface{}, error) {
	if value == "" {
		return nil, nil
	}

	switch field.Type {
	case pkg.FieldTypeString:
		return value, nil
	case pkg.FieldTypeInteger:
		// Try to parse as int
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal, nil
		}
		return nil, fmt.Errorf("invalid integer value: %s", value)
	case pkg.FieldTypeNumber:
		// Try to parse as float
		if floatVal, err := strconv.ParseFloat(value, 64); err == nil {
			return floatVal, nil
		}
		return nil, fmt.Errorf("invalid number value: %s", value)
	case pkg.FieldTypeBoolean:
		// Handle checkbox values
		return value == "on" || value == "true" || value == "1", nil
	case pkg.FieldTypeArray:
		// Split comma-separated values
		if value == "" {
			return []interface{}{}, nil
		}
		values := strings.Split(value, ",")
		result := make([]interface{}, len(values))
		for i, v := range values {
			result[i] = strings.TrimSpace(v)
		}
		return result, nil
	default:
		return value, nil
	}
}

func (s *Server) initFileManager(filename string) (*pkg.FileManager, error) {
	filePath := filepath.Join(s.dataDir, filename)
	return pkg.NewFileManager(filePath)
}

func (s *Server) getAvailableFiles() ([]FileInfo, error) {
	var files []FileInfo

	entries, err := os.ReadDir(s.dataDir)
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		name := entry.Name()
		ext := filepath.Ext(name)
		if ext == "" {
			continue
		}

		// Check if file is in the allowed list (if restrictions are set)
		if len(s.restrictFiles) > 0 {
			allowed := false
			for _, allowedFile := range s.restrictFiles {
				if allowedFile == name {
					allowed = true
					break
				}
			}
			if !allowed {
				continue
			}
		}

		filePath := filepath.Join(s.dataDir, name)
		fm, err := pkg.NewFileManager(filePath)
		if err != nil {
			continue
		}

		count, _ := fm.Count()
		fields, _ := fm.GetFields()

		// Get file size
		fileInfo, err := os.Stat(filePath)
		size := int64(0)
		modified := ""
		if err == nil {
			size = fileInfo.Size()
			modified = fileInfo.ModTime().Format("2006-01-02 15:04:05")
		}

		files = append(files, FileInfo{
			Name:      name,
			Path:      filePath,
			Format:    strings.TrimPrefix(ext, "."),
			Size:      size,
			Modified:  modified,
			ItemCount: count,
			Fields:    fields,
		})
	}

	return files, nil
}

func (s *Server) Start(port string) error {
	log.Printf("Server starting on port %s", port)
	return s.app.Listen(":" + port)
}
