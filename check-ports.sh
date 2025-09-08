#!/bin/bash

# Port Conflict Check Script for Anime Listing Website
# This script checks for port conflicts before deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Ports used by Anime Listing Website
ANIME_PORTS=(8090 8444 8081 8445 9114 9091 3001)
ANIME_PORT_NAMES=("Website HTTP" "Website HTTPS" "Traefik Dashboard" "Traefik HTTPS" "Nginx Exporter" "Prometheus" "Grafana")

print_message $BLUE "🔍 Checking for port conflicts..."
echo ""

# Function to check if port is in use
check_port() {
    local port=$1
    local service_name=$2
    
    if command -v netstat &> /dev/null; then
        if netstat -tuln | grep -q ":$port "; then
            return 0  # Port is in use
        fi
    elif command -v ss &> /dev/null; then
        if ss -tuln | grep -q ":$port "; then
            return 0  # Port is in use
        fi
    elif command -v lsof &> /dev/null; then
        if lsof -i :$port &> /dev/null; then
            return 0  # Port is in use
        fi
    else
        print_message $YELLOW "⚠️  No port checking tool available (netstat, ss, or lsof)"
        return 1
    fi
    
    return 1  # Port is free
}

# Function to get process using port
get_port_process() {
    local port=$1
    
    if command -v lsof &> /dev/null; then
        lsof -i :$port 2>/dev/null | tail -n +2 | awk '{print $1, $2}' | head -1
    elif command -v netstat &> /dev/null; then
        netstat -tulnp 2>/dev/null | grep ":$port " | awk '{print $7}' | head -1
    elif command -v ss &> /dev/null; then
        ss -tulnp | grep ":$port " | awk '{print $6}' | head -1
    else
        echo "Unknown"
    fi
}

# Check each port
conflicts_found=false

for i in "${!ANIME_PORTS[@]}"; do
    port=${ANIME_PORTS[$i]}
    service=${ANIME_PORT_NAMES[$i]}
    
    if check_port $port; then
        conflicts_found=true
        process=$(get_port_process $port)
        print_message $RED "❌ Port $port ($service) is already in use by: $process"
    else
        print_message $GREEN "✅ Port $port ($service) is available"
    fi
done

echo ""

if [ "$conflicts_found" = true ]; then
    print_message $RED "🚫 Port conflicts detected!"
    echo ""
    print_message $YELLOW "Solutions:"
    echo "1. Stop conflicting services:"
    echo "   sudo systemctl stop <service-name>"
    echo "   docker stop <container-name>"
    echo ""
    echo "2. Or modify ports in docker-compose.yml"
    echo ""
    print_message $BLUE "Current running Docker containers:"
    docker ps --format "table {{.Names}}\t{{.Ports}}" 2>/dev/null || echo "Docker not available"
    
    exit 1
else
    print_message $GREEN "🎉 No port conflicts found! Ready to deploy."
    echo ""
    print_message $BLUE "Anime Listing Website will use these ports:"
    for i in "${!ANIME_PORTS[@]}"; do
        echo "  - ${ANIME_PORTS[$i]}: ${ANIME_PORT_NAMES[$i]}"
    done
    echo ""
    print_message $YELLOW "To start deployment:"
    echo "  ./deploy.sh start dev    # Development mode"
    echo "  ./deploy.sh start prod   # Production mode"
fi
