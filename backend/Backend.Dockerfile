# Sets the base image of the application to the node’s official image.
FROM node:20

# Sets the Working Directory as "/backend"
RUN mkdir -p /backend
WORKDIR /backend
# Copies the package.json file into "/backend" and runs npm i
COPY ./package.json /backend
RUN npm i
RUN npm uninstall bcrypt
RUN npm i bcrypt
# Copies the entire source code into "/backend"
COPY . /backend

# Specifies the port the node app will be running on
EXPOSE 5001

# Runs "node server.js" after the above step is completed
# CMD ["nodemon", "index.js"]
CMD ["npm", "run", "dev"]