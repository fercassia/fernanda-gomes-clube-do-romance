## STAGE 1: Development Environment ##
FROM node:24.10.0-alpine AS development

WORKDIR /usr/src

COPY --chown=node:node package*.json ./

RUN npm pkg delete scripts.prepare

RUN npm ci

COPY --chown=node:node . .

USER node

## STAGE 2: Build for Production ##
FROM node:24.10.0-alpine AS build

WORKDIR /usr/src

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

# Seta production em NODE_ENV como variavel de ambiente
ENV NODE_ENV=${ENVIRONMENT:-production}

RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

USER node

## STAGE 3: Production ##
FROM node:24.10.0-alpine AS production

WORKDIR /usr/src

COPY --chown=node:node --from=build /usr/src/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/dist ./dist

CMD [ "node", "dist/main.js" ]