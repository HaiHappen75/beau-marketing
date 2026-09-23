import type { CollectionConfig } from 'payload'

import { publicReadAccess } from '../access'
import { slugField } from '../fields/slug'

/**
 * Public author profiles (E-E-A-T, Person schema) — deliberately separate from
 * login accounts: guest authors and interviewees need no login.
 */
export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: { singular: 'Autor', plural: 'Autoren' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role'], group: 'Ratgeber' },
  access: publicReadAccess,
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    slugField('name'),
    { name: 'role', label: 'Rolle', type: 'text', localized: true },
    { name: 'bio', label: 'Kurzbio', type: 'textarea', localized: true },
    { name: 'photo', label: 'Foto', type: 'upload', relationTo: 'media' },
    {
      name: 'sameAs',
      label: 'Profil-Links',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      admin: { description: 'LinkedIn usw. – landen als sameAs im Person-Schema.' },
      fields: [{ name: 'url', label: 'URL', type: 'text', required: true }],
    },
    {
      name: 'user',
      label: 'Nutzerkonto',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', description: 'Optional.' },
    },
  ],
}
