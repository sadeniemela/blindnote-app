import { PUBLISHER, SITE_DESCRIPTION, SITE_URL } from "@/lib/site"

// /llms.txt is a plain text summary for AI assistants, so they can describe
// Blindnote correctly and know how to use the API. Format: https://llmstxt.org
export const dynamic = "force-static"

export function GET() {
  const body = `# Blindnote

> ${SITE_DESCRIPTION}

Blindnote is a web app for collecting anonymous feedback. A user logs in with a 6 digit code sent by email, creates a form and shares its link. People answering need no account, and answers are never linked to a name, email or IP address. The app is available in Finnish and English. Made by ${PUBLISHER.name} (${PUBLISHER.url}).

## Features

- Forms with open text questions, star ratings from 1 to 5 and multiple choice questions
- Results by question: average and distribution for ratings, counts for choices, a list of text answers
- One shareable link per form, no login for people answering
- Public JSON API for sending answers
- Rate limits against spam and login code guessing

## Pages

- [Front page with a live demo](${SITE_URL}/): what Blindnote is and a demo form to try without an account
- [Login](${SITE_URL}/login): log in or create an account with an email code

## API

- Send an answer: POST ${SITE_URL}/api/forms/{formId}/responses with JSON {"answers": [{"questionId": "...", "value": "..."}]}. Ratings are "1" to "5", choices must match an option. Returns 201, 400, 404 or 429.
- Try it with the demo form: POST ${SITE_URL}/api/forms/demo/responses with JSON {"content": "your answer"}
- Managing forms (GET, POST /api/forms, GET and DELETE /api/forms/{id}) requires a logged in session.
`

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
