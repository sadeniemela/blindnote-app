# Blindnote

Anonymous feedback with one link. Create a form with open questions, star ratings or multiple choice, share the link, and read honest answers. People answering need no account, and answers are never linked to a name, email or IP address.

Built with Next.js (App Router), Auth.js (email login code via Resend), Prisma and Postgres (Supabase), and Tailwind CSS. The UI is in Finnish and English.

## Running locally

1. Install packages (this also generates the Prisma client):

   ```bash
   npm install
   ```

2. Create `.env` with these variables:

   | Variable | What it is |
   | --- | --- |
   | `DATABASE_URL` | Postgres connection through the pooler, used by the app |
   | `DIRECT_URL` | Direct Postgres connection, used for migrations |
   | `AUTH_SECRET` | Random secret for Auth.js. Create one with `npx auth secret` |
   | `AUTH_RESEND_KEY` | Resend API key for sending login codes |

3. Apply the database migrations:

   ```bash
   npx prisma migrate deploy
   ```

4. Start the dev server and open http://localhost:3000:

   ```bash
   npm run dev
   ```

Resend in test mode only delivers email to the address of the Resend account owner. To let anyone log in, verify your own domain in Resend and change the `from` address in `auth.ts`.

## Deploying to Vercel

Import the GitHub repository in Vercel, add the four environment variables above, and deploy. Run `npx prisma migrate deploy` against the production database whenever a new migration is added.

## API

All requests and responses are JSON. Errors always look like `{ "error": "message" }`.

### Send an answer (public, no login)

```
POST /api/forms/{formId}/responses
```

For a form with questions, send one answer per question you want to answer. Every question is optional, but at least one answer is required.

```json
{
  "answers": [
    { "questionId": "q1", "value": "The demo went well" },
    { "questionId": "q2", "value": "4" },
    { "questionId": "q3", "value": "Meetings" }
  ]
}
```

| Question type | Valid value |
| --- | --- |
| `text` | Any text, max 2000 characters |
| `rating` | A whole number from `"1"` to `"5"` |
| `choice` | Exactly one of the question's options |

Older forms without questions take `{ "content": "text" }` instead.

Responses:

| Status | Meaning |
| --- | --- |
| `201` | Saved. Body: `{ "id": "...", "createdAt": "..." }` |
| `400` | Invalid body, see `error` |
| `404` | Form not found |
| `429` | Too many answers from the same visitor, try again later |

Example with curl, using the demo form on the landing page:

```bash
curl -X POST http://localhost:3000/api/forms/demo/responses -H "Content-Type: application/json" -d '{"content":"Hello from curl"}'
```

### Forms (login required)

These use the session cookie of a logged in user. Without it they return `401`. A form that belongs to someone else returns `403`.

| Method and path | What it does |
| --- | --- |
| `GET /api/forms` | Your forms, newest first, with answer and question counts |
| `POST /api/forms` | Create a form, returns `201` and the form with its questions |
| `GET /api/forms/{id}` | One form with its questions and all answers |
| `DELETE /api/forms/{id}` | Delete a form and all of its answers |

Body for creating a form:

```json
{
  "title": "Team retro, week 45",
  "description": "Optional, max 500 characters",
  "questions": [
    { "type": "text", "label": "What went well?" },
    { "type": "rating", "label": "How happy were you with the sprint?" },
    { "type": "choice", "label": "What took most of the time?", "options": ["Meetings", "Bugs"] }
  ]
}
```

Limits: title max 120 characters, max 20 questions, label max 200 characters, a choice question needs 2 to 10 options of max 80 characters each. Without `questions` the form gets one open text question.

## Rate limits

Counters are stored in the `RateLimit` table, so they work on serverless hosting where memory is not shared between requests. The visitor IP is only used as a salted one way hash inside these counters.

| What | Limit |
| --- | --- |
| Login codes sent to one email | 3 per 10 minutes |
| Login codes requested from one IP | 10 per hour |
| Login code guesses for one email | 5 per 10 minutes |
| Answers from one IP to one form | 10 per 10 minutes |

Login codes are 6 digits, valid for 10 minutes, and only a hash of the code is stored.

## Project structure

| Path | Contents |
| --- | --- |
| `app/api` | REST API route handlers |
| `app/dashboard` | Pages for logged in users. The layout checks the login |
| `app/f/[id]` | Public answer page |
| `app/login` | Login with email code |
| `app/common` | Shared components. `ui.tsx` holds the shared styles |
| `lib/forms.ts` | Database functions for forms and answers |
| `lib/questions.ts` | Validation rules shared by the API and the form builder |
| `lib/rate-limit.ts` | Rate limiting |
| `lib/i18n` | Finnish and English texts |
| `prisma` | Database schema and migrations |
