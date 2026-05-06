# Smart AI Tourism Bracelet Backend

## Stack

- Node.js
- Express.js
- OpenAI API
- Multer for audio upload
- JSON file storage for a simple demo-ready persistence layer

## Run

1. Copy `.env.example` to `.env`
2. Fill in `OPENAI_API_KEY` and `JWT_SECRET`
3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm run dev
```

## Main API Groups

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/chat`
- `POST /api/translate`
- `POST /api/speech/speech-to-text`
- `POST /api/speech/text-to-speech`
- `POST /api/speech/bracelet-pipeline`
- `GET /api/convert`
- `GET /api/places`
- `POST /api/places/visit`
- `POST /api/recommend`
- `GET /api/stats`

## Bracelet Flow

The `POST /api/speech/bracelet-pipeline` route simulates the bracelet:

1. Receive audio from the mobile app or future ESP32
2. Convert speech to text
3. Translate the detected text
4. Convert the translated text back to speech
5. Return transcript, translated text, and base64 audio data

## Notes

- Storage is file-based for easy PFE setup and demos.
- The architecture is ready to swap JSON storage for MongoDB or PostgreSQL later.
- `examples/postman-examples.md` contains ready-to-test requests.
