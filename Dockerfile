FROM node:12.18.1
ENV NODE_ENV=development
ENV PORT=3000
ENV PG_USER=dbmasteruser
ENV PG_PASSWORD=baishaly123
ENV PG_DATABASE=postgres
ENV PG_HOST=ls-cfd3c7449cb823bbb9c74730db5e6056876c2aee.cpryfr3ooru3.ap-south-1.rds.amazonaws.com
ENV PG_PORT=5432
ENV JWT_SECRET=sdvbhebvjebu34r8u3hf34hy39cb93h43hghcb234hc249nu3h3b3434h
ENV NEW_RELIC_LICENSE_KEY=a81ed8f4b139a88ba08c1f8dbf6d5dc308a7NRAL
ENV RE_CAPTCHA_SECRET=6Lex7VQeAAAAANiRhOrQ4WStgdeX1SbmjTcZUh8R

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install 

COPY . .

CMD [ "node", "server.js" ]
