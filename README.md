# CORE--BE


## Build Project
- Install Docker
- Install nodejs version > 20

- Copy .env.example to .env
```bash
cp .env.example .env

```
- Config in .env

- Build Docker

```bash
docker compose up -d

```

- Start app on local
```bash
yarn dev
```
- In browser, access `http://localhost:${APP_PORT}/`
  
## Combined with ngrok


```bash
brew install ngrok/ngrok/ngrok

ngrok config add-authtoken <token>

ngrok http http://localhost:${APP_PORT}
```


- In Client, connect with domain of ngrok
