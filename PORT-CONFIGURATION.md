# 🔧 Port Configuration - Conflict Resolution

## 📊 Port Mapping Changes

To avoid conflicts with existing services on your server, I've updated all port mappings:

### 🌐 **Original vs New Port Mapping**

| Service | Original Port | New Port | Purpose |
|---------|---------------|----------|---------|
| **Website HTTP** | 80 | **8090** | Main anime listing website |
| **Website HTTPS** | 443 | **8444** | HTTPS for main website |
| **Traefik Dashboard** | 8080 | **8081** | Reverse proxy dashboard |
| **Traefik HTTPS** | 8443 | **8445** | Traefik HTTPS endpoint |
| **Nginx Exporter** | 9113 | **9114** | Nginx metrics exporter |
| **Prometheus** | 9090 | **9091** | Metrics collection |
| **Grafana** | 3000 | **3001** | Monitoring dashboard |

### 🚫 **Detected Conflicts on Your Server**

From your `docker ps` output, these ports were already in use:
- **Port 3000**: Dokploy
- **Port 3306**: MySQL database  
- **Port 5000**: PKT Monthly Record App
- **Port 5432**: PostgreSQL
- **Port 8080**: PKT Monthly Record Nginx
- **Port 8443**: PKT Monthly Record HTTPS

### ✅ **New Access URLs**

After deployment, your anime listing website will be available at:

#### **Development Mode:**
- **Website**: http://localhost:8090
- **Traefik Dashboard**: http://localhost:8081
- **Prometheus**: http://localhost:9091  
- **Grafana**: http://localhost:3001 (admin/admin123)

#### **Production Mode:**
- **Website**: http://localhost:8090 (redirects to HTTPS)
- **Website HTTPS**: https://localhost:8444
- **Monitoring**: https://localhost:8444/monitoring (if configured)

### 🛠️ **How to Deploy**

1. **Check for conflicts first:**
```bash
./check-ports.sh
# or
./deploy.sh check
```

2. **Start the application:**
```bash
# Development mode
./deploy.sh start dev

# Production mode  
./deploy.sh start prod
```

3. **Verify deployment:**
```bash
./deploy.sh status
./deploy.sh health
```

### 🔍 **Port Checking**

The deployment now includes automatic port conflict detection:
- Runs before deployment starts
- Shows which processes are using conflicting ports
- Provides solutions for resolving conflicts

### 📝 **Configuration Files Updated**

✅ `docker-compose.yml` - Development configuration
✅ `docker-compose.prod.yml` - Production configuration  
✅ `deploy.sh` - Deployment script
✅ `.env.example` - Environment variables
✅ `DEPLOYMENT.md` - Documentation
✅ `check-ports.sh` - Port conflict checker (new)

### 🎯 **Benefits of New Configuration**

1. **No Conflicts**: Avoids all existing service ports
2. **Easy to Remember**: Sequential port numbering
3. **Production Ready**: Separate dev/prod configurations
4. **Monitoring Included**: Full observability stack
5. **Conflict Detection**: Automatic port checking

### 🚀 **Ready to Deploy**

Your anime listing website is now configured to run without any port conflicts on your server. The new port mapping ensures compatibility with your existing services while providing all the features you need.

---

**🎌 Your anime listing website will run smoothly alongside your existing services!**
