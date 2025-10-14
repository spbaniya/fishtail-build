package main

import (
	"backend/pkg"
	"encoding/base64"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"golang.org/x/crypto/bcrypt"
)

type Server struct {
	app           *fiber.App
	fileManager   *pkg.FileManager
	dataDir       string
	restrictFiles []string
	users         []User
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

type TemplateData struct {
	Title       string
	Files       []FileInfo
	CurrentFile *FileInfo
	Items       []map[string]any
	Item        map[string]any
	Fields      []string
	Errors      []string
	Success     string
	Page        int
	TotalPages  int
	Search      string
	SortField   string
	SortOrder   string
}

func NewServer(dataDir string, restrictFiles ...string) *Server {
	// Create Fiber app (using embedded templates)
	app := fiber.New()

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New())

	server := &Server{
		app:     app,
		dataDir: dataDir,
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
	s.app.Post("/api/files/:filename/items", s.handleCreateItem)
	s.app.Post("/api/files/:filename/items/:id", s.handleUpdateItem)
	s.app.Delete("/api/files/:filename/items/:id", s.handleDeleteItem)
	s.app.Get("/api/files/:filename/items", s.handleListItems)
	s.app.Get("/api/files/:filename/fields", s.handleGetFields)
}

func (s *Server) handleHome(c *fiber.Ctx) error {
	files, err := s.getAvailableFiles()
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	data := TemplateData{
		Title: "File Manager",
		Files: files,
	}

	c.Set("Content-Type", "text/html")
	return templates.ExecuteTemplate(c, "index", data)
}

func (s *Server) handleFileView(c *fiber.Ctx) error {
	filename := c.Params("filename")
	page := c.QueryInt("page", 1)
	search := c.Query("search", "")
	sortField := c.Query("sort", "")
	sortOrder := c.Query("order", "asc")

	// Initialize file manager
	fm, err := s.initFileManager(filename)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	// Get items with pagination and search
	var items []map[string]any
	if search != "" {
		items, err = fm.Search(search, false)
	} else {
		items, err = fm.Read()
	}
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	// Sort if requested
	if sortField != "" {
		err = fm.Sort(sortField, sortOrder == "asc")
		if err == nil && search == "" {
			items, _ = fm.Read() // Re-read after sorting
		}
	}

	// Pagination
	pageSize := 10
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

	// Get fields
	fields, _ := fm.GetFields()

	// Get file size
	fileStat, err := os.Stat(filepath.Join(s.dataDir, filename))
	size := int64(0)
	modified := ""
	if err == nil {
		size = fileStat.Size()
		modified = fileStat.ModTime().Format("2006-01-02 15:04:05")
	}

	fileInfo := &FileInfo{
		Name:      filename,
		Path:      filepath.Join(s.dataDir, filename),
		Format:    strings.TrimPrefix(filepath.Ext(filename), "."),
		Size:      size,
		Modified:  modified,
		ItemCount: totalItems,
		Fields:    fields,
	}

	data := TemplateData{
		Title:       fmt.Sprintf("File: %s", filename),
		CurrentFile: fileInfo,
		Items:       items,
		Page:        page,
		TotalPages:  totalPages,
		Search:      search,
		SortField:   sortField,
		SortOrder:   sortOrder,
	}

	c.Set("Content-Type", "text/html")
	return templates.ExecuteTemplate(c, "file_view", data)
}

func (s *Server) handleCreateForm(c *fiber.Ctx) error {
	filename := c.Params("filename")

	fm, err := s.initFileManager(filename)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	fields, _ := fm.GetFields()

	// Get file size and item count
	fileStat, err := os.Stat(filepath.Join(s.dataDir, filename))
	size := int64(0)
	modified := ""
	if err == nil {
		size = fileStat.Size()
		modified = fileStat.ModTime().Format("2006-01-02 15:04:05")
	}
	count, _ := fm.Count()

	fileInfo := &FileInfo{
		Name:      filename,
		Path:      filepath.Join(s.dataDir, filename),
		Format:    strings.TrimPrefix(filepath.Ext(filename), "."),
		Size:      size,
		Modified:  modified,
		ItemCount: count,
		Fields:    fields,
	}

	data := TemplateData{
		Title:       fmt.Sprintf("Create Item - %s", filename),
		CurrentFile: fileInfo,
		Item:        make(map[string]any),
	}

	c.Set("Content-Type", "text/html")
	return templates.ExecuteTemplate(c, "item_form", data)
}

func (s *Server) handleEditForm(c *fiber.Ctx) error {
	filename := c.Params("filename")
	id := c.Params("id")

	fm, err := s.initFileManager(filename)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	// Find item by ID across all sections
	items, _ := fm.Read()
	var item map[string]any
	var itemIndex int
	for i, section := range items {
		if sectionItems, ok := section["items"].([]interface{}); ok {
			for j, it := range sectionItems {
				if itemMap, ok := it.(map[string]interface{}); ok {
					if fmt.Sprintf("%v", itemMap["id"]) == id {
						item = itemMap
						itemIndex = i*1000 + j // Simple way to encode section and item index
						break
					}
				}
			}
			if item != nil {
				break
			}
		}
	}

	if item == nil {
		return c.Status(404).SendString("Item not found")
	}

	fields, _ := fm.GetFields()

	// Get file size and item count
	fileStat, err := os.Stat(filepath.Join(s.dataDir, filename))
	size := int64(0)
	modified := ""
	if err == nil {
		size = fileStat.Size()
		modified = fileStat.ModTime().Format("2006-01-02 15:04:05")
	}
	count, _ := fm.Count()

	fileInfo := &FileInfo{
		Name:      filename,
		Path:      filepath.Join(s.dataDir, filename),
		Format:    strings.TrimPrefix(filepath.Ext(filename), "."),
		Size:      size,
		Modified:  modified,
		ItemCount: count,
		Fields:    fields,
	}

	data := TemplateData{
		Title:       fmt.Sprintf("Edit Item - %s", filename),
		CurrentFile: fileInfo,
		Item:        item,
	}

	// Store item index in locals for update
	c.Locals("itemIndex", itemIndex)
	c.Set("Content-Type", "text/html")
	return templates.ExecuteTemplate(c, "item_form", data)
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

func (s *Server) handleCreateItem(c *fiber.Ctx) error {
	filename := c.Params("filename")

	fm, err := s.initFileManager(filename)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	var item map[string]any
	id := c.FormValue("id")
	name := c.FormValue("name")
	description := c.FormValue("description")
	price := c.FormValue("price")
	category := c.FormValue("category")
	dietaryInfoStr := c.FormValue("dietaryInfo")

	if id == "" || name == "" || price == "" || category == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Required fields are missing"})
	}

	// Parse dietary info
	var dietaryInfo []string
	if dietaryInfoStr != "" {
		dietaryInfo = strings.Split(strings.TrimSpace(dietaryInfoStr), ",")
		for i, info := range dietaryInfo {
			dietaryInfo[i] = strings.TrimSpace(info)
		}
	}

	item = map[string]any{
		"id":          id,
		"name":        name,
		"description": description,
		"price":       price,
		"category":    category,
		"dietaryInfo": dietaryInfo,
	}

	if err := fm.Create(item); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"success": true, "message": "Item created"})
}

func (s *Server) handleUpdateItem(c *fiber.Ctx) error {
	filename := c.Params("filename")
	id := c.Params("id")

	fm, err := s.initFileManager(filename)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	// Parse form data
	name := c.FormValue("name")
	description := c.FormValue("description")
	price := c.FormValue("price")
	category := c.FormValue("category")
	dietaryInfoStr := c.FormValue("dietaryInfo")

	if name == "" || price == "" || category == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Required fields are missing"})
	}

	// Parse dietary info
	var dietaryInfo []string
	if dietaryInfoStr != "" {
		dietaryInfo = strings.Split(strings.TrimSpace(dietaryInfoStr), ",")
		for i, info := range dietaryInfo {
			dietaryInfo[i] = strings.TrimSpace(info)
		}
	}

	// Find and update item in nested structure
	items, _ := fm.Read()
	updated := false

	for i, section := range items {
		if sectionItems, ok := section["items"].([]interface{}); ok {
			for _, it := range sectionItems {
				if itemMap, ok := it.(map[string]interface{}); ok {
					if fmt.Sprintf("%v", itemMap["id"]) == id {
						// Update the item
						itemMap["name"] = name
						itemMap["description"] = description
						itemMap["price"] = price
						itemMap["category"] = category
						itemMap["dietaryInfo"] = dietaryInfo

						// Update the section's items array
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

	return c.Redirect(fmt.Sprintf("/files/%s", filename), 302)
}

func (s *Server) handleDeleteItem(c *fiber.Ctx) error {
	filename := c.Params("filename")
	id := c.Params("id")

	fm, err := s.initFileManager(filename)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	// Find and delete item
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

	return c.JSON(fiber.Map{
		"items":      items,
		"page":       page,
		"totalPages": totalPages,
		"totalItems": totalItems,
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
