# Stage 1: Build React Frontend
FROM node:24-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Python FastAPI Backend + Nginx
FROM python:3.13-slim
WORKDIR /app

# Install system dependencies & nginx
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend app & seed script
COPY backend ./backend

# Copy frontend dist output from Stage 1 to Nginx HTML dir
COPY --from=frontend-builder /app/dist /var/www/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/sites-enabled/default && ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

# Seed database on startup
RUN python backend/seed.py

EXPOSE 80 8000

CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 & nginx -g 'daemon off;'"]
