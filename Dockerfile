FROM node:16-bullseye

# Copy application to container
WORKDIR /app
COPY ./src /app/src
COPY ./.babelrc package-lock.json package.json pm2.config.js tsconfig.json /app/

# Install dependencies
ENV NPM_CONFIG_LOGLEVEL=warn

RUN npm install -g npm pm2 husky \
   && npm install \
	 && npm run build:js \
	 && rm -r ./src package*

# Setup execution environment
ENV NODE_ENV='production'
ENV DEBUG='false'

# Run application
EXPOSE 8000
EXPOSE 9000

CMD ["pm2-runtime", "--env", "production", "start", "pm2.config.js"]
