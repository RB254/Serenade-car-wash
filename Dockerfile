FROM node:20
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy all project files
COPY . .

# Install dependencies allowing build scripts, then build
RUN pnpm install --no-frozen-lockfile --shamefully-hoist --config.ignore-build-scripts=false
RUN pnpm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
