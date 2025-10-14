package main

import (
	"fmt"
	"html/template"
	"strings"
)

// Helper functions for templates
func hasField(data interface{}, field string) bool {
	// Simple implementation - in a real app you'd use reflection
	return true
}

func fieldValue(data interface{}, field string) interface{} {
	// Simple implementation - in a real app you'd use reflection
	return ""
}

func dec(i int) int {
	return i - 1
}

func inc(i int) int {
	return i + 1
}

func toJson(data interface{}) string {
	// Simple JSON marshaling for template
	if data == nil {
		return "{}"
	}
	// For now, return a simple string representation
	// In a real app, you'd use json.Marshal
	return fmt.Sprintf("%v", data)
}

var templates = template.Must(template.New("").Funcs(template.FuncMap{
	"join":       strings.Join,
	"lower":      strings.ToLower,
	"upper":      strings.ToUpper,
	"title":      strings.Title,
	"hasField":   hasField,
	"fieldValue": fieldValue,
	"safeHTML":   func(s string) template.HTML { return template.HTML(s) },
	"dec":        dec,
	"inc":        inc,
	"toJson":     toJson,
}).Parse(""))

func init() {
	// Parse templates from string constants
	templates = template.Must(templates.New("index").Parse(indexTemplate))
	templates = template.Must(templates.New("file_view").Parse(fileViewTemplate))
	templates = template.Must(templates.New("item_form").Parse(itemFormTemplate))
}

const indexTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Manager</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">File Manager</h1>

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
                                <td class="px-4 py-2 whitespace-nowrap text-sm font-medium">
                                    <a href="/files/{{.Name}}" class="text-indigo-600 hover:text-indigo-900 mr-2">View</a>
                                    <a href="/files/{{.Name}}/create" class="text-green-600 hover:text-green-900 mr-2">Create Item</a>
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

const fileViewTemplate = `<!DOCTYPE html>
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
            </div>

            <div class="bg-gray-50 rounded p-4">
                {{if .Items}}
                    {{range .Items}}
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{.title}}</h3>
                            {{if .subtitle}}<p class="text-sm text-gray-600 mb-3">{{.subtitle}}</p>{{end}}
                            <div class="overflow-x-auto">
                                <table class="min-w-full table-auto mb-4">
                                    <thead>
                                        <tr class="bg-gray-100">
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dietary Info</th>
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        {{range .items}}
                                        <tr class="hover:bg-gray-50">
                                            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{{.id}}</td>
                                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{.name}}</td>
                                            <td class="px-4 py-2 text-sm text-gray-500 max-w-xs truncate">{{.description}}</td>
                                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-semibold">{{.price}}</td>
                                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{{.category}}</td>
                                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {{range .dietaryInfo}}
                                                    <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">{{.}}</span>
                                                {{end}}
                                            </td>
                                            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium">
                                                <a href="/files/{{$.CurrentFile.Name}}/edit/{{.id}}" class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</a>
                                            </td>
                                        </tr>
                                        {{end}}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    {{end}}
                {{else}}
                    <p class="text-gray-500">No items found in this file.</p>
                {{end}}
            </div>

            <div class="mt-6 flex space-x-4">
                <a href="/files/{{.CurrentFile.Name}}/create" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Create Item</a>
            </div>
        </div>
    </div>
</body>
</html>`

const itemFormTemplate = `<!DOCTYPE html>
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
            <a href="/files" class="text-indigo-600 hover:text-indigo-900">&larr; Back to Files</a>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-4">{{if .Item}}Edit{{else}}Create{{end}} Item</h1>

            <form action="/api/files/{{.CurrentFile.Name}}/items{{if .Item}}/{{.Item.id}}{{end}}" method="post" class="space-y-4">
                {{if .Item}}<input type="hidden" name="_method" value="PUT">{{end}}

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">ID</label>
                        <input type="text" name="id" value="{{if .Item}}{{.Item.id}}{{end}}" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" value="{{if .Item}}{{.Item.name}}{{end}}" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">{{if .Item}}{{.Item.description}}{{end}}</textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Price</label>
                        <input type="text" name="price" value="{{if .Item}}{{.Item.price}}{{end}}" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Category</label>
                        <input type="text" name="category" value="{{if .Item}}{{.Item.category}}{{end}}" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Dietary Info (comma-separated)</label>
                        <input type="text" name="dietaryInfo" value="{{if .Item}}{{range .Item.dietaryInfo}}{{.}},{{end}}{{end}}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                </div>

                <div class="flex space-x-4">
                    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{{if .Item}}Update{{else}}Create{{end}} Item</button>
                    <a href="/files/{{.CurrentFile.Name}}" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>`
