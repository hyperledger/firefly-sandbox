FROM node:14-alpine

COPY --chown=node:node . /app

USER node

WORKDIR /app

# Build UI
RUN cd ui \
  && npm i \
  && npm run build

# Build Server
RUN cd /app/server \
  && npm i \
  && npm run build

ENV UI_PATH=/app/ui/build

CMD cd /app/server && npm run start