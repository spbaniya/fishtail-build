package pkg

import (
	"fmt"
	"html/template"
)

// DynamicTemplateGenerator generates HTML templates based on schema
type DynamicTemplateGenerator struct {
	schemaGenerator *SchemaGenerator
}

// NewDynamicTemplateGenerator creates a new dynamic template generator
func NewDynamicTemplateGenerator() *DynamicTemplateGenerator {
	return &DynamicTemplateGenerator{
		schemaGenerator: NewSchemaGenerator(),
	}
}

// GenerateTemplates generates all necessary templates for a given schema
func (dtg *DynamicTemplateGenerator) GenerateTemplates(schema *SchemaInfo) (map[string]string, error) {
	templates := make(map[string]string)

	// Generate index template (file listing)
	indexTmpl := dtg.GenerateIndexTemplate(schema)
	templates["index"] = indexTmpl

	// Generate file view template (data listing)
	fileViewTmpl := dtg.GenerateFileViewTemplate(schema)
	templates["file_view"] = fileViewTmpl

	// Generate form template (create/edit forms)
	formTmpl := dtg.GenerateFormTemplate(schema)
	templates["item_form"] = formTmpl

	return templates, nil
}

// GenerateIndexTemplate generates the main file listing template
func (dtg *DynamicTemplateGenerator) GenerateIndexTemplate(schema *SchemaInfo) string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic File Manager</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">Dynamic File Manager</h1>

        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 class="text-xl font-semibold mb-4">Upload New File</h2>
            <form action="/upload" method="post" enctype="multipart/form-data" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">File</label>
                    <input type="file" name="file" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Format</label>
                    <select name="format" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="json">JSON</option>
                        <option value="yaml">YAML</option>
                        <option value="csv">CSV</option>
                        <option value="xml">XML</option>
                    </select>
                </div>
                <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Upload</button>
            </form>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4">Files</h2>
            {{if .Files}}
                <div class="overflow-x-auto">
                    <table class="min-w-full table-auto">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            {{range .Files}}
                            <tr>
                                <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{{.Name}}</td>
                                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{{.Format}}</td>
                                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{{.Size}} bytes</td>
                                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{{.Modified}}</td>
                                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{{.ItemCount}} items</td>
                                <td class="px-4 py-2 whitespace-nowrap text-sm font-medium">
                                    <a href="/files/{{.Name}}" class="text-indigo-600 hover:text-indigo-900 mr-2">View</a>
                                    <a href="/files/{{.Name}}/create" class="text-green-600 hover:text-green-900 mr-2">Create</a>
                                </td>
                            </tr>
                            {{end}}
                        </tbody>
                    </table>
                </div>
            {{else}}
                <p class="text-gray-500">No files found.</p>
            {{end}}
        </div>
    </div>
</body>
</html>`
}

// GenerateFileViewTemplate generates the data listing template
func (dtg *DynamicTemplateGenerator) GenerateFileViewTemplate(schema *SchemaInfo) string {
	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View File - {{.CurrentFile.Name}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="mb-4">
            <a href="/files" class="text-indigo-600 hover:text-indigo-900">&larr; Back to Files</a>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-4">{{.CurrentFile.Name}}</h1>
            <div class="mb-4">
                <span class="text-sm text-gray-500">Format: {{.CurrentFile.Format}}</span>
                <span class="text-sm text-gray-500 ml-4">Size: {{.CurrentFile.Size}} bytes</span>
                <span class="text-sm text-gray-500 ml-4">Modified: {{.CurrentFile.Modified}}</span>
                <span class="text-sm text-gray-500 ml-4">Items: {{.CurrentFile.ItemCount}}</span>
            </div>

            {{if .Items}}
                <div class="mb-4 flex justify-between items-center">
                    <div class="flex space-x-4">
                        <input type="text" id="searchInput" placeholder="Search..." class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value="{{.Search}}">
                        <select id="sortField" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">Sort by...</option>
                            {{range .Fields}}
                            <option value="{{.Name}}" {{if eq $.SortField "{{.Name}}"}}selected{{end}}>{{.Name}}</option>
                            {{end}}
                        </select>
                        <select id="sortOrder" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="asc" {{if eq .SortOrder "asc"}}selected{{end}}>Ascending</option>
                            <option value="desc" {{if eq .SortOrder "desc"}}selected{{end}}>Descending</option>
                        </select>
                    </div>
                    <a href="/files/{{.CurrentFile.Name}}/create" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Create New Item</a>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full table-auto">
                        <thead>
                            <tr class="bg-gray-50">
                                {{range .Fields}}
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{.Name}}</th>
                                {{end}}
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            {{range .Items}}
                            <tr class="hover:bg-gray-50">
                                {{range $.Fields}}
                                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{formatValue (index $.Item "{{.Name}}")}}</td>
                                {{end}}
                                <td class="px-4 py-2 whitespace-nowrap text-sm font-medium">
                                    <a href="/files/{{$.CurrentFile.Name}}/edit/{{index $.Item "{{$.PrimaryKey}}"}}" class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</a>
                                    <a href="/files/{{$.CurrentFile.Name}}/delete/{{index $.Item "{{$.PrimaryKey}}"}}" class="text-red-600 hover:text-red-900" onclick="return confirm('Are you sure?')">Delete</a>
                                </td>
                            </tr>
                            {{end}}
                        </tbody>
                    </table>
                </div>

                {{if gt .TotalPages 1}}
                <div class="mt-4 flex justify-center">
                    <div class="flex space-x-2">
                        {{if gt .Page 1}}
                        <a href="?page={{dec .Page}}{{if .Search}}&search={{.Search}}{{end}}{{if .SortField}}&sort={{.SortField}}&order={{.SortOrder}}{{end}}" class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Previous</a>
                        {{end}}

                        {{range $i := (seq 1 .TotalPages)}}
                        <a href="?page={{$i}}{{if $.Search}}&search={{$.Search}}{{end}}{{if $.SortField}}&sort={{$.SortField}}&order={{$.SortOrder}}{{end}}" class="px-3 py-2 border border-gray-300 rounded-md {{if eq $i $.Page}}bg-indigo-600 text-white{{else}}hover:bg-gray-50{{end}}">{{$i}}</a>
                        {{end}}

                        {{if lt .Page .TotalPages}}
                        <a href="?page={{inc .Page}}{{if .Search}}&search={{.Search}}{{end}}{{if .SortField}}&sort={{.SortField}}&order={{.SortOrder}}{{end}}" class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Next</a>
                        {{end}}
                    </div>
                </div>
                {{end}}
            {{else}}
                <div class="text-center py-8">
                    <p class="text-gray-500 mb-4">No items found in this file.</p>
                    <a href="/files/{{.CurrentFile.Name}}/create" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Create First Item</a>
                </div>
            {{end}}
        </div>
    </div>

    <script>
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', function(e) {
            const search = e.target.value;
            const url = new URL(window.location);
            if (search) {
                url.searchParams.set('search', search);
            } else {
                url.searchParams.delete('search');
            }
            url.searchParams.set('page', '1');
            window.location.href = url.toString();
        });

        // Sort functionality
        document.getElementById('sortField').addEventListener('change', function(e) {
            const sortField = e.target.value;
            const url = new URL(window.location);
            if (sortField) {
                url.searchParams.set('sort', sortField);
            } else {
                url.searchParams.delete('sort');
            }
            url.searchParams.set('page', '1');
            window.location.href = url.toString();
        });

        document.getElementById('sortOrder').addEventListener('change', function(e) {
            const sortOrder = e.target.value;
            const url = new URL(window.location);
            url.searchParams.set('order', sortOrder);
            url.searchParams.set('page', '1');
            window.location.href = url.toString();
        });
    </script>
</body>
</html>`, dtg.getPrimaryKey(schema))
}

// GenerateFormTemplate generates the create/edit form template
func (dtg *DynamicTemplateGenerator) GenerateFormTemplate(schema *SchemaInfo) string {
	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{if .Item}}Edit{{else}}Create{{end}} Item</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="mb-4">
            <a href="/files/{{.CurrentFile.Name}}" class="text-indigo-600 hover:text-indigo-900">&larr; Back to Files</a>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-4">{{if .Item}}Edit{{else}}Create{{end}} Item</h1>

            <form action="/api/files/{{.CurrentFile.Name}}/items{{if .Item}}/{{index .Item "{{.PrimaryKey}}"}}{{"}}" method="post" class="space-y-4">
                {{if .Item}}<input type="hidden" name="_method" value="PUT">{{end}}

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {{range .Fields}}
                    <div class="{{if gt (len $.Fields) 6}}md:col-span-2{{else}}md:col-span-1{{end}}">
                        <label class="block text-sm font-medium text-gray-700">{{.Name}}</label>
                        {{if eq .Type "boolean"}}
                            <div class="mt-1">
                                <label class="inline-flex items-center">
                                    <input type="checkbox" name="{{.Name}}" {{if .Required}}required{{end}} {{if index $.Item "{{.Name}}"}}checked{{end}} class="form-checkbox h-5 w-5 text-indigo-600">
                                    <span class="ml-2 text-sm text-gray-700">{{.Name}}</span>
                                </label>
                            </div>
                        {{else if .Enum}}
                            <select name="{{.Name}}" {{if .Required}}required{{end}} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="">Select {{.Name}}</option>
                                {{range .Enum}}
                                <option value="{{.}}" {{if eq (index $.Item "{{$.Name}}") .}}selected{{end}}>{{.}}</option>
                                {{end}}
                            </select>
                        {{else if eq .Type "array"}}
                            <input type="text" name="{{.Name}}" value="{{if index $.Item "{{.Name}}"}}{{"{{"}}range index $.Item "{{$.Name}}"}}{{.}},{{end}}{{end}}" {{if .Required}}required{{end}} placeholder="Comma-separated values" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        {{else if eq .Type "number"}}
                            <input type="number" name="{{.Name}}" value="{{if index $.Item "{{.Name}}"}}{{"{{"}}index $.Item "{{.Name}}"}}{{"}}" {{end}}" step="any" {{if .Required}}required{{end}} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        {{else if eq .Type "integer"}}
                            <input type="number" name="{{.Name}}" value="{{if index $.Item "{{.Name}}"}}{{"{{"}}index $.Item "{{.Name}}"}}{{"}}" {{end}}" step="1" {{if .Required}}required{{end}} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        {{else}}
                            <input type="text" name="{{.Name}}" value="{{if index $.Item "{{.Name}}"}}{{"{{"}}index $.Item "{{.Name}}"}}{{"}}" {{end}}" {{if .Required}}required{{end}} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        {{end}}
                        {{if .Description}}<p class="mt-1 text-sm text-gray-500">{{.Description}}</p>{{end}}
                    </div>
                    {{end}}
                </div>

                <div class="flex space-x-4">
                    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{{if .Item}}Update{{else}}Create{{end}} Item</button>
                    <a href="/files/{{.CurrentFile.Name}}" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>`, dtg.getPrimaryKey(schema))
}

// getPrimaryKey returns the primary key field name or "id" as default
func (dtg *DynamicTemplateGenerator) getPrimaryKey(schema *SchemaInfo) string {
	if schema.PrimaryKey != "" {
		return schema.PrimaryKey
	}
	return "id"
}

// Helper functions for templates
func formatValue(value interface{}) string {
	if value == nil {
		return ""
	}
	return fmt.Sprintf("%v", value)
}

// Template helper functions
var DynamicTemplateFuncs = template.FuncMap{
	"formatValue": formatValue,
	"seq": func(start, end int) []int {
		var result []int
		for i := start; i <= end; i++ {
			result = append(result, i)
		}
		return result
	},
	"dec": func(i int) int { return i - 1 },
	"inc": func(i int) int { return i + 1 },
	"eq":  func(a, b interface{}) bool { return fmt.Sprintf("%v", a) == fmt.Sprintf("%v", b) },
}
