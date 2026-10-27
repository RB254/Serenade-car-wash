FROM node:20
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy all project files
COPY . .

# Install dependencies allowing build scripts, then build
RUN pnpm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
