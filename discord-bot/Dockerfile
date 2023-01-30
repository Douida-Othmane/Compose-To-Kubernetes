FROM node:alpine
COPY . .
RUN npm install
RUN node deploy-commands.js
ENV NODE_OPTIONS=--max-old-space-size=16000
EXPOSE 3000
ENTRYPOINT ["npm", "start"]