# Eclipse Sales Platform - Production Deployment Guide

This guide covers deploying the Eclipse Sales Platform to production using Docker containers.

## Prerequisites

- Docker and Docker Compose installed
- Domain name configured (for SSL)
- SSL certificates (for HTTPS)
- Required API keys and environment variables

## Quick Start

1. **Clone and prepare environment**:
   ```bash
   git clone <your-repo>
   cd eclise_sales
   cp .env.production .env.production.local
   ```

2. **Configure environment variables** in `.env.production.local`:
   - Supabase URL and keys
   - OpenAI API key
   - Anthropic API key (optional)
   - Domain and security settings

3. **Deploy**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Manual Deployment

### 1. Environment Setup

Copy the production environment template:
```bash
cp .env.production .env.production.local
```

Edit `.env.production.local` with your actual values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key
OPENAI_API_KEY=sk-your_openai_key
# ... other variables
```

### 2. SSL Certificates

Place your SSL certificates in the `ssl/` directory:
```bash
mkdir ssl
# Copy your cert.pem and key.pem files to ssl/
```

### 3. Build and Deploy

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### 4. Health Checks

```bash
# Check frontend
curl http://localhost:3000

# Check API
curl http://localhost:8000/health

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Architecture

### Services

- **web**: Next.js frontend (port 3000)
- **api**: FastAPI backend (port 8000)
- **nginx**: Reverse proxy with SSL termination (ports 80/443)

### Network

- All services communicate through `eclipse-network`
- Nginx handles SSL termination and load balancing
- Rate limiting and security headers applied

## Performance Optimizations

### Frontend (Next.js)

- **Standalone output**: Minimal Docker image
- **Image optimization**: WebP/AVIF formats
- **Compression**: Gzip enabled
- **Security headers**: XSS protection, frame options
- **Bundle analysis**: `npm run build:analyze`

### Backend (FastAPI)

- **Multi-stage build**: Optimized Python image
- **Health checks**: Automatic container monitoring
- **Non-root user**: Security best practices

### Nginx

- **HTTP/2**: Enabled for better performance
- **Gzip compression**: Static and dynamic content
- **Rate limiting**: API and web endpoints
- **SSL/TLS**: Modern cipher suites
- **Static file caching**: 1-year cache for assets

## Monitoring and Maintenance

### Logs

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f web
docker-compose -f docker-compose.prod.yml logs -f api
```

### Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Backup

```bash
# Backup environment and logs
tar -czf backup-$(date +%Y%m%d).tar.gz .env.production.local logs/
```

## Scaling

### Horizontal Scaling

```bash
# Scale web service
docker-compose -f docker-compose.prod.yml up -d --scale web=3

# Scale API service
docker-compose -f docker-compose.prod.yml up -d --scale api=2
```

### Load Balancing

Nginx automatically load balances between multiple instances.

## Security

### Environment Variables

- Never commit `.env.production.local`
- Use strong, unique secrets
- Rotate API keys regularly

### SSL/TLS

- Use valid SSL certificates
- Enable HSTS headers
- Regular certificate renewal

### Container Security

- Non-root users in containers
- Minimal base images
- Regular security updates

## Troubleshooting

### Common Issues

1. **Service won't start**:
   ```bash
   docker-compose -f docker-compose.prod.yml logs [service-name]
   ```

2. **Environment variables not loaded**:
   - Check `.env.production.local` exists
   - Verify variable names match

3. **SSL certificate issues**:
   - Verify certificate files in `ssl/` directory
   - Check certificate validity

4. **Database connection issues**:
   - Verify Supabase URL and keys
   - Check network connectivity

### Performance Issues

1. **Slow page loads**:
   - Check bundle size with `npm run build:analyze`
   - Verify image optimization settings
   - Monitor network requests

2. **High memory usage**:
   - Monitor container resources
   - Check for memory leaks in logs
   - Consider scaling horizontally

## Support

For deployment issues:
1. Check logs first
2. Verify environment configuration
3. Test individual services
4. Review this documentation

---

**Note**: This deployment setup is production-ready but may need customization based on your specific infrastructure requirements.