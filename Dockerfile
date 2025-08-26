# Stage de construcción
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install -g ts-node
COPY . .
# RUN npm run seed
RUN npm run build

# Stage de producción
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/src/main.js"]