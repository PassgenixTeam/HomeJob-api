FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "dist/src/main.js"]
EXPOSE 4000