#!/bin/bash

# Build and run server health check script
# This script ensures the server is running and restarts it if needed

SERVER_DIR="$HOME/Sites/fishtail"
BUILD_DIR="$SERVER_DIR/build"
SERVER_BINARY="$BUILD_DIR/server"
LOG_FILE="$BUILD_DIR/server.log"
PID_FILE="$BUILD_DIR/server.pid"
PORT="3003"

# Function to check if port is in use
check_port() {
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to get process ID
get_pid() {
    if [ -f "$PID_FILE" ]; then
        cat "$PID_FILE" 2>/dev/null
    fi
}

# Function to check if process is running
is_process_running() {
    local pid=$1
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
        return 0  # Process is running
    else
        return 1  # Process is not running
    fi
}

# Function to start server
start_server() {
    echo "$(date): Starting server..." >> "$LOG_FILE"

    if [ ! -f "$SERVER_BINARY" ]; then
        echo "$(date): Server binary not found at $SERVER_BINARY" >> "$LOG_FILE"
        exit 1
    fi

    cd "$BUILD_DIR"

    # Start server in background
    nohup "$SERVER_BINARY" -data-dir=./data -port=$PORT >> "$LOG_FILE" 2>&1 &
    local pid=$!

    # Save PID
    echo $pid > "$PID_FILE"

    # Wait a moment and check if it's still running
    sleep 2
    if is_process_running $pid; then
        echo "$(date): Server started successfully with PID $pid" >> "$LOG_FILE"
        return 0
    else
        echo "$(date): Server failed to start" >> "$LOG_FILE"
        return 1
    fi
}

# Function to stop server
stop_server() {
    local pid=$(get_pid)
    if [ -n "$pid" ] && is_process_running $pid; then
        echo "$(date): Stopping server with PID $pid" >> "$LOG_FILE"
        kill $pid
        sleep 2

        # Force kill if still running
        if is_process_running $pid; then
            echo "$(date): Force killing server with PID $pid" >> "$LOG_FILE"
            kill -9 $pid
        fi

        # Clean up PID file
        rm -f "$PID_FILE"
        echo "$(date): Server stopped" >> "$LOG_FILE"
    fi
}

# Main logic
echo "$(date): Checking server status..." >> "$LOG_FILE"

# Check if port is in use
if check_port; then
    echo "$(date): Port $PORT is in use" >> "$LOG_FILE"

    # Check if our process is running
    pid=$(get_pid)
    if [ -n "$pid" ] && is_process_running $pid; then
        echo "$(date): Server is running with PID $pid" >> "$LOG_FILE"
        exit 0
    else
        echo "$(date): Port is in use but our process is not running. Cleaning up..." >> "$LOG_FILE"
        # Clean up stale PID file
        rm -f "$PID_FILE"
    fi
else
    echo "$(date): Port $PORT is free" >> "$LOG_FILE"
fi

# If we reach here, server is not running properly
echo "$(date): Server is not running. Starting..." >> "$LOG_FILE"

# Stop any existing processes on the port
if check_port; then
    echo "$(date): Killing existing process on port $PORT" >> "$LOG_FILE"
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# Start the server
if start_server; then
    echo "$(date): Server health check completed successfully" >> "$LOG_FILE"
    exit 0
else
    echo "$(date): Failed to start server" >> "$LOG_FILE"
    exit 1
fi
