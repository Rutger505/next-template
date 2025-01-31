# Next template

Next.js template for my personal needs.

## Getting started

### Installation and Configuration

In the [application.env](application.env) file you can find:

- The project name
- The docker repository

Copy the [.env.example](.env.example) file to a new file `.env` and fill in the variables.

```bash
cp .env.example .env
```

#### Variables

- `DOCKERHUB_USERNAME` - Dockerhub username

#### Secrets

- `DEPLOYMENT_DISCORD_WEBHOOK_URL` - Discord webhook url for deployment messages
- `DOCKERHUB_TOKEN` - Dockerhub password
-

## Deployments

To configure deployment variables. create a github variable or secret and prefix it with `DEPLOYMENT_`.
