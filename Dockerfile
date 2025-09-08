# Use the official Nginx image as base
FROM nginx:alpine

# Set maintainer label
LABEL maintainer="Anime Listing Team <info@animelisting.com>"
LABEL description="Anime Listing Website - Static web application"
LABEL version="1.0.0"

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy our website files to nginx html directory
COPY . /usr/share/nginx/html/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html

# Create nginx user if it doesn't exist
RUN addgroup -g 101 -S nginx || true
RUN adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx || true

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Add curl for health checks
RUN apk add --no-cache curl

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
