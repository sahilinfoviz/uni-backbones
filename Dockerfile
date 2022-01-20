FROM ghcr.io/baisali-pradhan/uni-backbones:main
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install 

COPY . .

CMD [ "node", "server.js" ]