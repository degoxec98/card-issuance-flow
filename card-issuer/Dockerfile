FROM node:24-alpine AS builder
WORKDIR /app

COPY card-issuer/package.json card-issuer/tsconfig.json ./card-issuer/
RUN cd card-issuer && npm install

COPY card-issuer/src ./card-issuer/src
RUN cd card-issuer && npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S app && adduser -S app -G app

COPY card-issuer/package.json ./card-issuer/
RUN cd card-issuer && npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/card-issuer/dist ./card-issuer/dist

USER app
WORKDIR /app/card-issuer
EXPOSE 3000
CMD ["node", "dist/src/server.js"]
