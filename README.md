# restaurant-service
## Stack
- Node Js v16
- TypeScript
- MongoDB

## Development quick start

### Setting up development environment

1. Clone repository

```bash
git clone .....
```

2. Install dependencies

```bash
npm install
```

### Running application in development mode

```bash
npm run start
```


### Building distribution code

```bash
npm run build
```

## Building docker image

```bash
docker build -t restaurant-service:latest .
```

## Docker-compose

Project contains `docker-compose.yml` for development environment.
Run `docker-compose up -d --build` to run development stack.

## Configuration

Application configuration variables are located in `.env.*` files. Each environment has its own configuration file.
Copy or download one.
```bash
cp .env.example .env
```
### Database
It is use mongodb as database, hosted in Mongo DB Atlas. Add the secrets of this in the .env file. 

## Production deployment

For `production` deployment of application:

1. Create container image `docker build -t restaurant-service:latest .`
2. Create (or download available) `.env` configuration file. Configuration from this file will be loaded by
   application during startup
3. Start container and mount `.env` file as volume

```bash
docker run -d -v /$(pwd)/.env:/app/.env -p 8000:8000 -p 9000:9000 --name restaurant-service restaurant-service:latest
```

- Application is accessible via port `8000`
