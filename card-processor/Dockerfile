FROM node:24-alpine AS builder
WORKDIR /app

COPY card-processor/package.json card-processor/tsconfig.json ./card-processor/
RUN cd card-processor && npm install

COPY card-processor/src ./card-processor/src
RUN cd card-processor && npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S app && adduser -S app -G app

COPY card-processor/package.json ./card-processor/
RUN cd card-processor && npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/card-processor/dist ./card-processor/dist

USER app
WORKDIR /app/card-processor
CMD ["node", "dist/src/main.js"]
