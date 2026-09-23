import type { TextFieldSingleValidation, TextareaFieldValidation } from 'payload'

// "Required in the admin, nullable in the database": used where rows already exist
// in production and a NOT NULL column would need an invented backfill value.
export const requiredText: TextFieldSingleValidation = (value) =>
  typeof value === 'string' && value.trim().length > 0 ? true : 'Pflichtfeld.'

export const requiredTextarea: TextareaFieldValidation = (value) =>
  typeof value === 'string' && value.trim().length > 0 ? true : 'Pflichtfeld.'
