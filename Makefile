# FishtailEats Build System
.PHONY: all build build-frontend build-backend clean install-frontend install-backend setup create-build-dir

# Default target
all: build

# Install dependencies
install: install-frontend install-backend

install-frontend:
	@echo "Installing frontend dependencies..."
	pnpm install

install-backend:
	@echo "Installing backend dependencies..."
	cd backend && go mod download

# Setup development environment
setup: install
	@echo "Development environment setup complete"

# Build all components
build: build-frontend build-backend create-build-dir

# Build frontend
build-frontend:
	@echo "Building frontend..."
	pnpm run build

# Build backend
build-backend:
	@echo "Building backend..."
	cd backend && go build -o server .

# Create build directory with all assets
create-build-dir: build-frontend build-backend
	@echo "Creating build directory..."
	@mkdir -p build
	@rm -rf build/dist
	@rm -rf build/data
	@rm -rf build/server
	@echo "Copying frontend assets..."
	@mv dist build/ 2>/dev/null || true
	@echo "Copying backend binary..."
	@mv backend/server build/
	@echo "Copying backend data..."
	@cp -r backend/data build/
	@echo "Build complete! Assets are in ./build/"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf build
	@rm -rf dist
	@rm -rf backend/server
	@rm -rf node_modules 2>/dev/null || true
	@cd backend && rm -rf vendor 2>/dev/null || true

# Development commands
dev-frontend:
	@echo "Starting frontend development server..."
	pnpm run dev

dev-backend:
	@echo "Starting backend development server..."
	cd backend && go run .

# Run tests
test-frontend:
	@echo "Running frontend tests..."
	pnpm run test:e2e

test-backend:
	@echo "Running backend tests..."
	cd backend && go test ./...

test: test-frontend test-backend

# Lint code
lint-frontend:
	@echo "Linting frontend code..."
	pnpm run lint

lint-backend:
	@echo "Linting backend code..."
	cd backend && golangci-lint run 2>/dev/null || echo "golangci-lint not installed, skipping backend lint"

lint: lint-frontend lint-backend

# Docker commands (if needed in future)
docker-build:
	@echo "Building Docker image..."
	docker build -t fishtail-eats .

docker-run:
	@echo "Running Docker container..."
	docker run -p 8080:8080 -p 3000:3000 fishtail-eats

# Help
help:
	@echo "Available commands:"
	@echo "  make install          - Install all dependencies"
	@echo "  make setup            - Setup development environment"
	@echo "  make build            - Build frontend, backend and create build directory"
	@echo "  make build-frontend   - Build only frontend"
	@echo "  make build-backend    - Build only backend"
	@echo "  make create-build-dir - Create build directory with all assets"
	@echo "  make clean            - Clean all build artifacts"
	@echo "  make dev-frontend     - Start frontend dev server"
	@echo "  make dev-backend      - Start backend dev server"
	@echo "  make test             - Run all tests"
	@echo "  make lint             - Lint all code"
	@echo "  make docker-build     - Build Docker image"
	@echo "  make docker-run       - Run Docker container"
	@echo "  make help             - Show this help message"
