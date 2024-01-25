FROM node:18
WORKDIR /app
ADD package.json /app/package.json
RUN yarn install
ADD . /app
EXPOSE 8000
CMD [ "yarn", "run", "start" ]