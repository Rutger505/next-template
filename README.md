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
- `DEPLOYMENT_AUTH_EMAIL_FROM` - Name and Email address of magic link sender (e.g. `Next Template <example@email.com>`)
- `DEPLOYMENT_AUTH_EMAIL_HOST` - SMTP host (e.g. `smtp.gmail.com`)
- `DEPLOYMENT_AUTH_EMAIL_PORT` - SMTP port (e.g. `465`)
- `DEPLOYMENT_AUTH_EMAIL_USER` - SMTP username (for gmail, this is your email address)

#### Secrets

- `DEPLOYMENT_AUTH_EMAIL_PASSWORD` - SMTP password (for gmail, this is your app password)
- `DEPLOYMENT_DISCORD_WEBHOOK_URL` - Discord webhook url for alerts in application
- `DOCKERHUB_TOKEN` - Dockerhub password

## Deployments

To configure deployment variables. create a github variable or secret and prefix it with `DEPLOYMENT_`.
