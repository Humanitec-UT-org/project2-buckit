###############################################################################
# deployable environment                                                      #
###############################################################################
FROM node:10 as deployable
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY server/package*.json ./

COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

RUN npm install

# Bundle app source
COPY server/ ./
COPY --from=build /app/build/ /usr/src/app/public/

EXPOSE 8080
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD [ "node", "./bin/www" ]
