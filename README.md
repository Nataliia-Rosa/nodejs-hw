# Notes API

Express API with MongoDB, session-based auth, password reset via email, and avatar uploads to Cloudinary.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Fill in `.env`:

```env
PORT=3000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_DOMAIN=http://localhost:3001
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_login
SMTP_PASSWORD=your_brevo_password
SMTP_FROM=your_brevo_email
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3. Start the server:

```bash
npm run dev
```

## Routes

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/request-reset-email`
- `POST /auth/reset-password`
- `GET /users/me`
- `PATCH /users/me/avatar`
- `GET /notes`
- `GET /notes/:noteId`
- `POST /notes`
- `PATCH /notes/:noteId`
- `DELETE /notes/:noteId`
