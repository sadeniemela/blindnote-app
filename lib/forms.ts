
import { prisma } from "./db";
import type { AnswerInput, QuestionInput } from "./questions";

// This file contains functions for interacting with the forms in the database. These functions are used in the API routes to perform CRUD operations on the forms.

// Function to get all forms for a user, ordered by creation date, and including the count of responses for each form.
export async function getForms(userId: string) {
    return await prisma.form.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { responses: true, questions: true } } }
    });
}

// Function to create a new form with its questions. Prisma creates the form and all
// questions in one transaction, so we never end up with a half saved form.
export async function createForm(userId: string, title: string, description: string | undefined, questions: QuestionInput[]) {
  return prisma.form.create({
    data: {
      userId,
      title,
      description,
      questions: {
        create: questions.map((q, position) => ({ ...q, position }))
      }
    },
    include: { questions: { orderBy: { position: "asc" } } }
  })
}

// Function to get a specific form by its ID, including all responses associated with that form.
export async function getForm(id: string) {
  return prisma.form.findUnique({
    where: { id },
    include: {
      questions: { orderBy: { position: "asc" } },
      responses: { orderBy: { createdAt: "desc" }, include: { answers: true } }
    }
  })
}

// Function to delete a form by its ID. This will also delete all responses associated with that form due to the cascading delete behavior defined in the Prisma schema.
export async function deleteForm(id: string) {
  return prisma.form.delete({
    where: { id }
  })
}

// Function to get only the public fields of a form. Used on the public feedback page,
// so that responses and the owner's id never leak to anonymous visitors.
export async function getPublicForm(id: string) {
  return prisma.form.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      questions: { orderBy: { position: "asc" }, select: { id: true, type: true, label: true, options: true } }
    }
  })
}

// Function to save an anonymous response. No user id is stored, which keeps it anonymous.
// Older forms without questions send plain content, newer forms send one answer per question.
export async function createResponse(formId: string, data: { content: string } | { answers: AnswerInput[] }) {
  return prisma.response.create({
    data: "content" in data
      ? { formId, content: data.content }
      : { formId, answers: { create: data.answers } },
    select: { id: true, createdAt: true }
  })
}
