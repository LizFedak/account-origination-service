FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV API_KEY=demo-key

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src
COPY openapi.yaml ./openapi.yaml
COPY postman ./postman

EXPOSE 3001

USER node

CMD ["node", "src/index.js"]
