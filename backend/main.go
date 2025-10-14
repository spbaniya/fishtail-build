package main

import (
	"backend/pkg"
	"fmt"
	"time"

	"github.com/oarkflow/jsonschema"
)

func main() {
	NewServer("./data").app.Listen(":8080")
}

func main1() {
	// Example 1: Menu sections with different formats
	fmt.Println("=== Menu Sections Example ===")

	// Create version and backup managers
	versionManager := pkg.NewVersionManager(".", 5)
	backupManager := pkg.NewBackupManager("./backups")

	menuFM, err := pkg.NewFileManagerWithOptions("data/menu.json", nil, versionManager, backupManager)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	// READ all sections
	sections, _ := menuFM.Read()
	fmt.Printf("✓ Found %d sections\n", len(sections))

	// FIND BY field
	appetizers, _ := menuFM.FindByField("title", "Appetizers - Vegetable")
	fmt.Printf("✓ Found %d appetizer sections\n", len(appetizers))

	// SEARCH functionality
	searchResults, _ := menuFM.Search("chicken", false)
	fmt.Printf("✓ Found %d items containing 'chicken'\n", len(searchResults))

	// PAGINATION
	page1, total, _ := menuFM.Paginate(1, 2)
	fmt.Printf("✓ Page 1: %d items (total: %d)\n", len(page1), total)

	// SORT by title
	menuFM.Sort("title", true)
	fmt.Println("✓ Sorted data by title")

	// VALIDATION - Create schema using jsonschema
	schemaContent := `{
		"type": "object",
		"properties": {
			"title": {"type": "string", "minLength": 1, "maxLength": 100},
			"price": {"type": "number", "minimum": 0, "maximum": 1000}
		},
		"required": ["title"]
	}`
	compiler := jsonschema.NewCompiler()
	menuSchema, err := compiler.Compile([]byte(schemaContent))
	if err != nil {
		fmt.Printf("Schema compile error: %v\n", err)
	} else {
		menuFM.SetSchema(menuSchema)
		fmt.Println("✓ Schema set")
	}

	// VALIDATE existing data
	validationErrors := menuFM.ValidateData()
	if len(validationErrors) > 0 {
		fmt.Printf("✓ Found %d validation errors\n", len(validationErrors))
	} else {
		fmt.Println("✓ All data is valid")
	}

	// CREATE VERSION
	if err := menuFM.CreateVersion(); err != nil {
		fmt.Printf("Version error: %v\n", err)
	} else {
		fmt.Println("✓ Version created")
	}

	// CREATE BACKUP
	backupPath, err := menuFM.CreateBackup()
	if err != nil {
		fmt.Printf("Backup error: %v\n", err)
	} else {
		fmt.Printf("✓ Backup created: %s\n", backupPath)
	}

	// CONVERT FORMAT
	if err := menuFM.ConvertFormat(&pkg.YAMLFormat{}, "data/menu.yaml"); err != nil {
		fmt.Printf("Convert error: %v\n", err)
	} else {
		fmt.Println("✓ Converted to YAML format")
	}

	fmt.Println()

	// Example 2: Users with CSV format
	fmt.Println("=== Users Example (CSV) ===")

	userFM, err := pkg.NewFileManagerWithFormat("data/users.csv", &pkg.CSVFormat{})
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	// CREATE BATCH
	users := []map[string]any{
		{"id": "u1", "name": "Alice", "email": "alice@example.com", "age": 30, "active": true},
		{"id": "u2", "name": "Bob", "email": "bob@example.com", "age": 25, "active": true},
		{"id": "u3", "name": "Charlie", "email": "charlie@example.com", "age": 35, "active": false},
	}

	if err := userFM.CreateBatch(users); err != nil {
		fmt.Printf("CreateBatch error: %v\n", err)
	} else {
		fmt.Println("✓ Users created in CSV format")
	}

	// FIND BY custom predicate
	activeUsers, _ := userFM.FindBy(func(item map[string]any) bool {
		active, ok := item["active"].(bool)
		return ok && active
	})
	fmt.Printf("✓ Found %d active users\n", len(activeUsers))

	// FIND ONE BY field
	user, idx, _ := userFM.FindOneByField("email", "bob@example.com")
	if user != nil {
		fmt.Printf("✓ Found user '%s' at index %d\n", user["name"], idx)
	}

	// UPDATE user
	userFM.Update(idx, map[string]any{
		"id":           "u2",
		"name":         "Bob Smith",
		"email":        "bob@example.com",
		"age":          26,
		"active":       true,
		"lastModified": time.Now().Format(time.RFC3339),
	})
	fmt.Println("✓ Updated Bob's data")

	// DELETE BY field
	deleted, _ := userFM.DeleteByField("active", false)
	fmt.Printf("✓ Deleted %d inactive users\n", deleted)

	// GET all field names
	fields, _ := userFM.GetFields()
	fmt.Printf("✓ Available fields: %v\n", fields)

	// COUNT
	totalUsers, _ := userFM.Count()
	fmt.Printf("✓ Total users: %d\n", totalUsers)

	// GET STATISTICS
	stats, _ := userFM.GetStatistics()
	fmt.Printf("✓ Statistics: %v\n", stats)

	fmt.Println()

	// Example 3: XML Format
	fmt.Println("=== Products Example (XML) ===")

	productFM, err := pkg.NewFileManagerWithFormat("data/products.xml", &pkg.XMLFormat{})
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	products := []map[string]any{
		{"id": "p1", "name": "Laptop", "price": 999.99, "category": "Electronics"},
		{"id": "p2", "name": "Book", "price": 19.99, "category": "Education"},
	}

	if err := productFM.CreateBatch(products); err != nil {
		fmt.Printf("CreateBatch error: %v\n", err)
	} else {
		fmt.Println("✓ Products created in XML format")
	}

	// FILTER products
	expensiveProducts, _ := productFM.Filter(func(item map[string]any) bool {
		price, ok := item["price"].(float64)
		return ok && price > 100
	})
	fmt.Printf("✓ Found %d expensive products\n", len(expensiveProducts))

	fmt.Println()

	// Example 4: Supported formats
	fmt.Println("=== Supported Formats ===")
	supportedFormats := menuFM.GetSupportedFormats()
	fmt.Printf("✓ Supported file formats: %v\n", supportedFormats)

	fmt.Println("\n=== Demo Complete ===")
}
