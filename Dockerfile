FROM node:lts-alpine

RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app/
RUN npm install --silent --quiet

COPY . /app/
RUN npm run build
#RUN npm prune --production

CMD ["node", "/app/dist/server/main.js"]