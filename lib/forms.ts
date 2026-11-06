
import { prisma } from "./db";

// This file contains functions for interacting with the forms in the database. These functions are used in the API routes to perform CRUD operations on the forms.

// Function to get all forms for a user, ordered by creation date, and including the count of responses for each form.
export async function getForms(userId: string) {
    return await prisma.form.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { responses: true } } }
    });
}

// Function to create a new form with the given user ID, title, and optional description.
export async function createForm(userId: string, title: string, description?: string) {
  return prisma.form.create({
    data: { userId, title, description }
  })
}

// Function to get a specific form by its ID, including all responses associated with that form.
export async function getForm(id: string) {
  return prisma.form.findUnique({
    where: { id },
    include: { responses: true }
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
    select: { id: true, title: true, description: true }
  })
}

// Function to save an anonymous response. No user id is stored, which keeps it anonymous.
export async function createResponse(formId: string, content: string) {
  return prisma.response.create({
    data: { formId, content },
    select: { id: true, createdAt: true }
  })
}
