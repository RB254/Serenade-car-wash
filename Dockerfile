FROM node:20
WORKDIR /app

# Enable pnpm (pinned to v10 to match this workspace's config)
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy all project files
COPY . .

# Install dependencies
RUN pnpm install --no-frozen-lockfile --shamefully-hoist

# Replit-generated Vite configs usually require these at build time
ENV PORT=3000
ENV BASE_PATH=/

# Build only the site (change "aquasonic" if your site folder has another name)
RUN pnpm --filter ./artifacts/aquasonic run build

# Collect build output into /site (works whether output is dist/public or dist)
RUN mkdir -p /site && \
    if [ -d artifacts/aquasonic/dist/public ]; then \
      cp -r artifacts/aquasonic/dist/public/. /site/; \
    else \
      cp -r artifacts/aquasonic/dist/. /site/; \
    fi

# Stage 2: Serve static files with Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /site /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
