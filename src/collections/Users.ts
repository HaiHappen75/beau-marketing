import type { CollectionConfig } from 'payload'

import { adminField, hasRole, isAdmin } from '../access'

/**
 * Login accounts for the admin. Two roles: Admin (users, settings, seed) and
 * Redaktion (content). Public author profiles live separately in `authors`.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Set deliberately instead of relying on defaults: admin-only login, the admin
    // UI refreshes the token on its own while open — 2 h idle means logout.
    tokenExpiration: 7200,
    cookies: {
      // Hard `true` would lock the cookie out of Safari on http://localhost.
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
    // Payload's built-in reset mail is English and unbranded — this one matches the admin.
    forgotPassword: {
      generateEmailSubject: () => 'Passwort zurücksetzen — Beau Marketing',
      generateEmailHTML: ({ req, token } = {}) => {
        const serverURL = req?.payload.config.serverURL || 'https://beau-marketing.de'
        const resetURL = `${serverURL}/admin/reset/${token}`
        return `
          <p>Hallo,</p>
          <p>für dein Backend von Beau Marketing wurde ein neues Passwort angefordert.
             Über diesen Link vergibst du es:</p>
          <p><a href="${resetURL}">${resetURL}</a></p>
          <p>Der Link ist <strong>eine Stunde</strong> gültig. Wenn du das nicht warst,
             kannst du diese E-Mail ignorieren — dein bisheriges Passwort bleibt gültig.</p>
        `
      },
    },
  },
  labels: { singular: 'Nutzer', plural: 'Nutzer' },
  admin: {
    useAsTitle: 'username',
    defaultColumns: ['username', 'email', 'firstName', 'lastName', 'role'],
    group: 'System',
    description: 'Login-Konten für das Backend.',
  },
  access: {
    // Everyone logged in may read and edit their own account; only admins manage others.
    read: ({ req: { user } }) =>
      hasRole(user, 'admin') ? true : user ? { id: { equals: user.id } } : false,
    create: isAdmin,
    update: ({ req: { user } }) =>
      hasRole(user, 'admin') ? true : user ? { id: { equals: user.id } } : false,
    delete: isAdmin,
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'username',
      label: 'Benutzername',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'firstName', label: 'Vorname', type: 'text', admin: { width: '50%' } },
        { name: 'lastName', label: 'Name', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'role',
      label: 'Rolle',
      type: 'select',
      required: true,
      defaultValue: 'redaktion',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Redaktion', value: 'redaktion' },
      ],
      access: { create: adminField, update: adminField },
      admin: { position: 'sidebar', description: 'Admin: Nutzer, Einstellungen, Seed. Redaktion: Inhalte.' },
    },
    {
      name: 'author',
      label: 'Autorenprofil',
      type: 'relationship',
      relationTo: 'authors',
      admin: { position: 'sidebar', description: 'Optional: das öffentliche Profil dieses Kontos.' },
    },
  ],
}
