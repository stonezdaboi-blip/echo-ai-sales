FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force

# Copy compiled code
COPY --from=build /app/dist ./dist

# Copy the SQL migration files (this was missing)
COPY --from=build /app/src/db/migrations ./src/db/migrations

EXPOSE 3000

CMD ["npm", "start"]
