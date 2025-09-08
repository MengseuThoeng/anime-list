#!/bin/bash

# Anime Listing Website Deployment Script
# This script helps deploy the anime listing website using Docker Compose

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

# Function to check if Docker is installed and running
check_docker() {
    print_message $BLUE "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_message $RED "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_message $RED "Docker is not running. Please start Docker service."
        exit 1
    fi
    
    print_message $GREEN "Docker is installed and running."
}

# Function to check if Docker Compose is installed
check_docker_compose() {
    print_message $BLUE "Checking Docker Compose installation..."
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_message $RED "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_message $GREEN "Docker Compose is available."
}

# Function to create environment file
setup_env() {
    if [[ ! -f .env ]]; then
        print_message $YELLOW "Creating .env file from template..."
        cp .env.example .env
        print_message $GREEN ".env file created. Please review and update the values as needed."
    else
        print_message $GREEN ".env file already exists."
    fi
}

# Function to build and start services
start_services() {
    local environment=${1:-development}
    
    print_message $BLUE "Starting Anime Listing Website in $environment mode..."
    
    if [[ $environment == "production" ]]; then
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
    else
        docker-compose up -d --build
    fi
    
    print_message $GREEN "Services started successfully!"
}

# Function to stop services
stop_services() {
    print_message $BLUE "Stopping services..."
    docker-compose down
    print_message $GREEN "Services stopped."
}

# Function to view logs
view_logs() {
    local service=${1:-anime-listing-web}
    print_message $BLUE "Viewing logs for $service..."
    docker-compose logs -f $service
}

# Function to show status
show_status() {
    print_message $BLUE "Service Status:"
    docker-compose ps
    
    print_message $BLUE "\nContainer Health:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Function to run health checks
health_check() {
    print_message $BLUE "Running health checks..."
    
    # Check if web service is responding
    if curl -f http://localhost:80 &> /dev/null; then
        print_message $GREEN "✓ Web service is healthy"
    else
        print_message $RED "✗ Web service is not responding"
    fi
    
    # Check if monitoring is enabled and running
    if docker-compose ps | grep -q "prometheus"; then
        if curl -f http://localhost:9090 &> /dev/null; then
            print_message $GREEN "✓ Prometheus is healthy"
        else
            print_message $RED "✗ Prometheus is not responding"
        fi
    fi
    
    if docker-compose ps | grep -q "grafana"; then
        if curl -f http://localhost:3000 &> /dev/null; then
            print_message $GREEN "✓ Grafana is healthy"
        else
            print_message $RED "✗ Grafana is not responding"
        fi
    fi
}

# Function to clean up
cleanup() {
    print_message $YELLOW "This will remove all containers, networks, and volumes. Are you sure? (y/N)"
    read -r response
    if [[ $response =~ ^[Yy]$ ]]; then
        print_message $BLUE "Cleaning up..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_message $GREEN "Cleanup completed."
    else
        print_message $BLUE "Cleanup cancelled."
    fi
}

# Function to show help
show_help() {
    echo "Anime Listing Website Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  start [dev|prod]     Start the application (default: dev)"
    echo "  stop                 Stop all services"
    echo "  restart [dev|prod]   Restart the application"
    echo "  logs [service]       View logs (default: anime-listing-web)"
    echo "  status               Show service status"
    echo "  health               Run health checks"
    echo "  cleanup              Remove all containers and volumes"
    echo "  help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start dev         Start in development mode"
    echo "  $0 start prod        Start in production mode"
    echo "  $0 logs nginx        View nginx logs"
    echo "  $0 status            Show all service status"
}

# Function to enable monitoring
enable_monitoring() {
    print_message $BLUE "Enabling monitoring stack..."
    docker-compose --profile monitoring up -d
    print_message $GREEN "Monitoring enabled!"
    print_message $YELLOW "Grafana: http://localhost:3000 (admin/admin123)"
    print_message $YELLOW "Prometheus: http://localhost:9090"
}

# Main script logic
main() {
    case ${1:-help} in
        "start")
            check_docker
            check_docker_compose
            setup_env
            start_services ${2:-development}
            print_message $GREEN "\n🎌 Anime Listing Website is running!"
            print_message $YELLOW "Website: http://localhost:80"
            if [[ ${2:-development} == "development" ]]; then
                print_message $YELLOW "Traefik Dashboard: http://localhost:8080"
            fi
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            stop_services
            start_services ${2:-development}
            ;;
        "logs")
            view_logs $2
            ;;
        "status")
            show_status
            ;;
        "health")
            health_check
            ;;
        "cleanup")
            cleanup
            ;;
        "monitoring")
            enable_monitoring
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
