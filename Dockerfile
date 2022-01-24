FROM node:12.18.1
ENV NODE_ENV="production"
ENV PORT=3000
ENV PG_USER=dbmasteruser
ENV PG_PASSWORD=baishaly123
ENV PG_DATABASE=V0.1-DB
ENV PG_HOST=3.108.202.169
ENV PG_PORT=5432
ENV JWT_SECRET=sdvbhebvjebu34r8u3hf34hy39cb93h43hghcb234hc249nu3h3b3434h

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install 

COPY . .

CMD [ "node", "server.js" ]