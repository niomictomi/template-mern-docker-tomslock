# Official node image
FROM node:20

WORKDIR /frontend

COPY package.json /frontend
RUN npm install
COPY . /frontend

EXPOSE 3003
# Starting the react app
CMD [ "npm", "start"]