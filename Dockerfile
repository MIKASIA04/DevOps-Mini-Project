
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY app.js ./
COPY test ./test

EXPOSE 3000

CMD ["npm", "start"]
