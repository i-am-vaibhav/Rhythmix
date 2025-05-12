#############################################
# Stage 1: Build with Node.js (Alpine)
#############################################
FROM node:21-alpine AS builder

WORKDIR /app

# Install only production deps for build speed
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

#############################################
# Stage 2: Serve static assets via nginx with CORS
#############################################
FROM nginx:alpine AS production

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Add custom nginx config
COPY nginx.conf /etc/nginx/conf.d/microfrontend.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

#############################################
# (Optional) Node-based preview (if dynamic features needed)
#############################################
#FROM node:18-alpine AS preview
#WORKDIR /app
#ENV NODE_ENV=production
#COPY --from=builder /app/package.json /app/package-lock.json ./
#RUN npm ci --only=production
#COPY --from=builder /app/dist ./dist
#EXPOSE 3002
#CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
