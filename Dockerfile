FROM node:16.13-alpine3.14 AS builder
WORKDIR /app
COPY . .
COPY ./yarn.lock .
RUN yarn install && yarn build
RUN yarn install --production

FROM node:16.13-alpine3.14
RUN apk update && apk upgrade
RUN npm install -g npm@8.11.0
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
RUN mkdir -p ./logs
RUN chown appuser:appgroup ./logs
USER appuser
COPY --chown=appuser:appgroup --from=builder /app/package.json /app/yarn.lock ./
COPY --chown=appuser:appgroup --from=builder /app/dist ./dist
COPY --chown=appuser:appgroup --from=builder /app/node_modules ./node_modules
EXPOSE 3000
EXPOSE 5000
CMD yarn start:prod
