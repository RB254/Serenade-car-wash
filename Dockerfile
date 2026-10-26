FROM node:20-alpine AS build
WORKDIR /app

# Enable pnpm inside the container
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package management files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies without strict lockfile version enforcement
RUN pnpm install --no-frozen-lockfile

# Copy source code and build
COPY . .
RUN pnpm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
