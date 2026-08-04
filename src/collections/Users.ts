import type { CollectionConfig } from 'payload'

/** Admin accounts. Locked to authenticated users — no public registration in Phase 1. */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Payload's built-in reset mail is English and unbranded — this one matches the admin.
    forgotPassword: {
      generateEmailSubject: () => 'Passwort zurücksetzen — Beau-Marketing',
      generateEmailHTML: ({ req, token } = {}) => {
        const serverURL = req?.payload.config.serverURL || 'https://beau-marketing.de'
        const resetURL = `${serverURL}/admin/reset/${token}`
        return `
          <p>Hallo,</p>
          <p>für dein Beau-Marketing-Backend wurde ein neues Passwort angefordert.
             Über diesen Link vergibst du es:</p>
          <p><a href="${resetURL}">${resetURL}</a></p>
          <p>Der Link ist <strong>eine Stunde</strong> gültig. Wenn du das nicht warst,
             kannst du diese E-Mail ignorieren — dein bisheriges Passwort bleibt gültig.</p>
        `
      },
    },
  },
  admin: {
    useAsTitle: 'email',
    group: 'System',
    description: 'Admin-Zugänge.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [{ name: 'name', type: 'text' }],
}
