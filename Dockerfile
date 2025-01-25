FROM node:22-alpine AS base

WORKDIR /app


FROM base AS development

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]


FROM base AS deps

COPY package.json package-lock.json ./

RUN npm ci


FROM base AS builder

# Client side environment variables must be set here.
# They won't be read from .env file during runtime

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create cache directory and set permissions
RUN mkdir -p /app/.next/cache && chmod 777 /app/.next/cache

# Create volume specifically for the cache
VOLUME ["/app/.next/cache"]

#Debug if cache is being used
RUN ls -la /app/.next/cache || echo "No cache directory found before build"

RUN SKIP_ENV_VALIDATION=1 npm run build

RUN ls -la /app/.next/cache || echo "Cache directory not found after build"

FROM base AS production

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]