# 🐳 Docker Deployment Guide for Anime Listing Website

This guide provides comprehensive instructions for deploying the Anime Listing Website using Docker and Docker Compose.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Deployment Modes](#deployment-modes)
- [Monitoring](#monitoring)
- [SSL/HTTPS Setup](#ssl-https-setup)
- [Scaling](#scaling)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

## 🔧 Prerequisites

### System Requirements
- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Memory**: Minimum 1GB RAM (2GB recommended)
- **Storage**: Minimum 5GB free space
- **OS**: Linux, macOS, or Windows with WSL2

### Installation

#### Install Docker
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# macOS (using Homebrew)
brew install --cask docker

# Windows
# Download Docker Desktop from https://www.docker.com/products/docker-desktop
```

#### Install Docker Compose
```bash
# Linux
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# macOS/Windows - Included with Docker Desktop
```

## 🚀 Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd anime-listing

# Make deployment script executable (Linux/macOS)
chmod +x deploy.sh

# Setup environment
cp .env.example .env
```

### 2. Start Development Environment
```bash
# Using deployment script (recommended)
./deploy.sh start dev

# Or using Docker Compose directly
docker-compose up -d --build
```

### 3. Access the Application
- **Website**: http://localhost:8090
- **Traefik Dashboard**: http://localhost:8081

### 4. Enable Monitoring (Optional)
```bash
./deploy.sh monitoring
```
- **Grafana**: http://localhost:3001 (admin/admin123)
- **Prometheus**: http://localhost:9091

## ⚙️ Configuration

### Environment Variables (.env)

```bash
# Application Configuration
APP_NAME=anime-listing
DOMAIN=animelisting.com
NODE_ENV=development

# SSL Configuration
SSL_EMAIL=admin@animelisting.com

# Monitoring
GRAFANA_ADMIN_PASSWORD=your_secure_password

# Performance
NGINX_WORKER_PROCESSES=auto
GZIP_ENABLED=true
```

### Custom Nginx Configuration

The `nginx.conf` file includes:
- **Security headers** (XSS protection, content type options)
- **Gzip compression** for better performance
- **Caching rules** for static assets
- **Error handling** and logging

## 🌍 Deployment Modes

### Development Mode
```bash
# Start development environment
./deploy.sh start dev

# Features:
# - Traefik dashboard enabled
# - Detailed logging
# - Auto-reload on changes
# - Debug mode enabled
```

### Production Mode
```bash
# Start production environment
./deploy.sh start prod

# Features:
# - SSL/HTTPS enabled
# - Security headers enforced
# - Monitoring stack included
# - Optimized for performance
```

## 🔐 SSL/HTTPS Setup

### Automatic SSL with Let's Encrypt

The production setup includes automatic SSL certificate generation:

```yaml
# In docker-compose.prod.yml
traefik:
  command:
    - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
    - "--certificatesresolvers.letsencrypt.acme.email=admin@animelisting.com"
```

### Custom SSL Certificates

1. Create SSL directory:
```bash
mkdir ssl
```

2. Place your certificates:
```bash
ssl/
├── certificate.crt
├── private.key
└── ca_bundle.crt
```

3. Update nginx configuration to use custom certificates.

## 📊 Monitoring

### Included Monitoring Stack

1. **Prometheus**: Metrics collection
2. **Grafana**: Visualization dashboards
3. **Nginx Exporter**: Web server metrics

### Enable Monitoring
```bash
# Start with monitoring
docker-compose --profile monitoring up -d

# Or using deployment script
./deploy.sh monitoring
```

### Access Monitoring Tools
- **Grafana**: http://localhost:3000
  - Username: admin
  - Password: admin123 (change in .env)
- **Prometheus**: http://localhost:9090

### Custom Metrics

The setup monitors:
- HTTP response times
- Request rates
- Error rates
- Server resource usage
- Website uptime

## 🔧 Docker Compose Services

### Core Services

#### anime-listing-web
- **Purpose**: Main web application
- **Technology**: Nginx + Static files
- **Ports**: 80 (HTTP)
- **Health Check**: HTTP GET /
- **Restart Policy**: unless-stopped

#### traefik (Production)
- **Purpose**: Reverse proxy and SSL termination
- **Features**: Automatic SSL, Load balancing
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Dashboard**: 8080 (development only)

### Monitoring Services

#### prometheus
- **Purpose**: Metrics collection and storage
- **Port**: 9090
- **Configuration**: monitoring/prometheus.yml
- **Retention**: 15 days (configurable)

#### grafana
- **Purpose**: Metrics visualization
- **Port**: 3000
- **Default Login**: admin/admin123
- **Persistence**: grafana-data volume

#### nginx-exporter
- **Purpose**: Nginx metrics collection
- **Port**: 9113
- **Metrics Endpoint**: /metrics

## 🔄 Scaling

### Horizontal Scaling
```bash
# Scale web service to 3 replicas
docker-compose up -d --scale anime-listing-web=3

# Load balancing is handled automatically by Traefik
```

### Resource Limits
```yaml
# Add to docker-compose.yml
services:
  anime-listing-web:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using port 80
sudo lsof -i :80

# Stop conflicting services
sudo systemctl stop apache2
sudo systemctl stop nginx
```

#### Container Won't Start
```bash
# Check logs
docker-compose logs anime-listing-web

# Rebuild container
docker-compose up -d --build --force-recreate
```

#### SSL Certificate Issues
```bash
# Check Traefik logs
docker-compose logs traefik

# Verify domain DNS
nslookup animelisting.com

# Test certificate
openssl s_client -connect animelisting.com:443
```

### Health Checks
```bash
# Run built-in health checks
./deploy.sh health

# Manual health check
curl -f http://localhost:80/

# Check service status
./deploy.sh status
```

### Log Management
```bash
# View specific service logs
./deploy.sh logs anime-listing-web

# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f
```

## 🧹 Maintenance

### Regular Tasks

#### Update Containers
```bash
# Pull latest images
docker-compose pull

# Restart with new images
docker-compose up -d
```

#### Backup Data
```bash
# Backup volumes
docker run --rm -v anime-listing-grafana-data:/data -v $(pwd):/backup alpine tar czf /backup/grafana-backup.tar.gz -C /data .

# Backup SSL certificates
docker run --rm -v anime-listing-traefik-certs:/data -v $(pwd):/backup alpine tar czf /backup/ssl-backup.tar.gz -C /data .
```

#### Clean Up Resources
```bash
# Remove unused containers and images
./deploy.sh cleanup

# Or manually
docker system prune -f
docker volume prune -f
```

### Performance Optimization

#### Enable HTTP/2
```nginx
# In nginx.conf
listen 443 ssl http2;
```

#### Optimize Caching
```nginx
# Static assets caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### Database Optimization (Future)
```yaml
# If adding database
mysql:
  command: --innodb-buffer-pool-size=256M --query-cache-size=64M
```

## 📈 Monitoring and Alerting

### Grafana Dashboards

Pre-configured dashboards include:
- **Website Overview**: Response times, request rates
- **Infrastructure**: CPU, memory, disk usage
- **Error Tracking**: 4xx/5xx error rates
- **User Analytics**: Page views, session duration

### Prometheus Alerts

Example alert rules:
```yaml
# High error rate
- alert: HighErrorRate
  expr: rate(nginx_http_requests_total{status=~"5.."}[5m]) > 0.1
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: High error rate detected
```

### Log Aggregation

For production, consider adding:
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Loki + Grafana** for log aggregation
- **Fluentd** for log forwarding

## 🔒 Security Best Practices

### Container Security
- Use non-root user in containers
- Scan images for vulnerabilities
- Keep base images updated
- Use specific image tags, not `latest`

### Network Security
- Use internal networks for service communication
- Expose only necessary ports
- Implement proper firewall rules
- Use secrets management for sensitive data

### SSL/TLS Security
- Use strong cipher suites
- Enable HSTS headers
- Implement proper certificate management
- Regular certificate renewal

## 🚀 Deployment Scripts

### Available Commands
```bash
./deploy.sh start [dev|prod]    # Start application
./deploy.sh stop                # Stop all services
./deploy.sh restart [dev|prod]  # Restart application
./deploy.sh logs [service]      # View logs
./deploy.sh status              # Show service status
./deploy.sh health              # Run health checks
./deploy.sh cleanup             # Clean up resources
./deploy.sh monitoring          # Enable monitoring
```

### Automated Deployment

For CI/CD integration:
```bash
#!/bin/bash
# deployment-pipeline.sh

# Pull latest code
git pull origin main

# Build and deploy
./deploy.sh stop
./deploy.sh start prod

# Run health checks
./deploy.sh health

# Send notification
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Anime Listing deployed successfully!"}' \
  YOUR_SLACK_WEBHOOK_URL
```

## 📞 Support

### Getting Help
- Check container logs: `./deploy.sh logs`
- Review configuration: `docker-compose config`
- Test connectivity: `./deploy.sh health`
- Community support: [GitHub Issues](repository-issues-url)

### Performance Tuning
- Monitor resource usage with Grafana
- Optimize nginx configuration
- Configure appropriate cache headers
- Scale services based on load

---

**🎌 Happy Deploying! Your Anime Listing Website is ready for the world!**

*Last updated: September 8, 2025*
