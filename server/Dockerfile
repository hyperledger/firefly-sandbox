FROM node:14-alpine

COPY --chown=node:node . /app

USER node

WORKDIR /app

RUN npm i \
  && npm run build

CMD npm run start