# Next template

Next.js template for my personal needs.

## Getting started

### Configuration

In the [application.env](application.env) file you can find:

- The project name
- The docker repository

Copy the [.env.example](.env.example) file to a new file `.env` and fill in the variables.

```bash
cp .env.example .env
```

### Variables

- `DISCORD_WEBHOOK_URL` - Discord webhook url for deployment messages
- `DOCKERHUB_USERNAME` - Dockerhub username
- `DOCKERHUB_TOKEN` - Dockerhub password

## Roadmap

| Feature                                                                              | Status |
| ------------------------------------------------------------------------------------ | ------ |
| Next.js                                                                              | ✅     |
| TailwindCSS                                                                          | ✅     |
| TypeScript                                                                           | ✅     |
| ESLint                                                                               | ✅     |
| Prettier                                                                             | ✅     |
| SonarQube                                                                            | ❌️    |
| tRPC                                                                                 | ❌️    |
| Drizzle                                                                              | ❌️    |
| Authenticatie - With utility functions (Decide between next-auth, auth.js and lucia) | ❌️    |
| OpenTofu kubernetes configuration                                                    | ✅     |
| Automated deployments - Linting seperate from build                                  | ✅     |
| Discord webhook messages                                                             | ❌️    |
| Playwright Integration                                                               | ❌️    |

```

```
