# TourAssist-AI

## Run

From the project root:

```bash
npm start
```

This starts the backend on `http://localhost:5000`.

Useful commands:

```bash
npm run backend:dev
npm run mobile
npm run android
npm run web
```

## API checks

- Public health check: `GET http://localhost:5000/health`
- Dashboard endpoint: `GET http://localhost:5000/api/dashboard`

Note: `/api/dashboard` is protected and needs `Authorization: Bearer <token>`.
