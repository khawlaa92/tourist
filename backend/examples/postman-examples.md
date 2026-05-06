# Smart AI Tourism Bracelet Backend Examples

Base URL:

```text
http://localhost:5000/api
```

## 1. Register

```http
POST /auth/register
Content-Type: application/json

{
  "fullName": "Amira Ben Salah",
  "email": "amira@example.com",
  "password": "Tourism123!"
}
```

## 2. Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "amira@example.com",
  "password": "Tourism123!"
}
```

Save the returned `token` and send it as:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## 3. Logout

```http
POST /auth/logout
Authorization: Bearer YOUR_JWT_TOKEN
```

## 4. Forgot Password

```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "amira@example.com"
}
```

## 5. Reset Password

```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "RESET_TOKEN_FROM_FORGOT_PASSWORD",
  "newPassword": "NewPassword123!"
}
```

## 6. Chatbot

```http
POST /chat
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "message": "Suggest 3 historical places to visit in Tunis.",
  "history": [
    {
      "role": "user",
      "text": "I like architecture."
    }
  ]
}
```

## 7. Translate Text

```http
POST /translate
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "text": "Where is the nearest museum?",
  "targetLanguage": "French"
}
```

## 8. Translate Audio

Use `form-data`:

```text
POST /translate
Authorization: Bearer YOUR_JWT_TOKEN
audio: <audio_file>
targetLanguage: Arabic
sourceLanguage: English
```

## 9. Speech To Text

Use `form-data`:

```text
POST /speech/speech-to-text
Authorization: Bearer YOUR_JWT_TOKEN
audio: <audio_file>
language: en
```

## 10. Text To Speech

```http
POST /speech/text-to-speech
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "text": "Welcome to Smart AI Tourism Bracelet.",
  "voice": "alloy",
  "responseFormat": "mp3"
}
```

## 11. Bracelet Pipeline

Use `form-data`:

```text
POST /speech/bracelet-pipeline
Authorization: Bearer YOUR_JWT_TOKEN
audio: <audio_file>
sourceLanguage: Arabic
targetLanguage: English
voice: alloy
responseFormat: mp3
```

## 12. Currency Conversion

```http
GET /convert?from=USD&to=EUR&amount=100
```

## 13. Nearby Places

```http
GET /places?lat=36.8065&lng=10.1815&radius=1500
```

## 14. Record Visited Place

```http
POST /places/visit
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "placeName": "Medina of Tunis",
  "lat": 36.7991,
  "lng": 10.1710,
  "notes": "Historic center visit"
}
```

## 15. Recommendations

```http
POST /recommend
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "lat": 36.8065,
  "lng": 10.1815,
  "preferences": ["museum", "history", "architecture"]
}
```

## 16. Dashboard Statistics

```http
GET /stats
Authorization: Bearer YOUR_JWT_TOKEN
```
