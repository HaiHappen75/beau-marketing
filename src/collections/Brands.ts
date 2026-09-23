import type { CollectionConfig } from 'payload'
import { publicReadAccess } from '../access'
import { slugField } from '../fields/slug'

/** The portfolio: every brand/app shown on the home page + its own detail page. */
export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: { singular: 'Marke', plural: 'Marken' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'category', 'order'],
    group: 'Inhalte',
  },
  access: publicReadAccess,
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'app',
          admin: { width: '50%' },
          options: [
            { label: 'E-Commerce', value: 'ecommerce' },
            { label: 'App', value: 'app' },
            { label: 'Tool / Software', value: 'tool' },
          ],
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: { width: '50%', description: 'Sortierung auf der Startseite (klein = oben).' },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'live', value: 'live' },
        { label: 'Beta', value: 'beta' },
        { label: 'in Entwicklung', value: 'development' },
        { label: 'ausgeblendet', value: 'hidden' },
      ],
      admin: {
        position: 'sidebar',
        description: '„ausgeblendet“ = erscheint nirgends auf der Website (z. B. solange es nur eine Idee ist).',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: { description: 'Kurzer Claim. Erscheint auf Karte & Detailseite.' },
    },
    { name: 'description', type: 'richText', localized: true },
    {
      type: 'row',
      fields: [
        {
          name: 'platforms',
          type: 'select',
          hasMany: true,
          admin: { width: '50%' },
          options: [
            { label: 'iOS', value: 'ios' },
            { label: 'Android', value: 'android' },
            { label: 'macOS', value: 'macos' },
            { label: 'Web', value: 'web' },
          ],
        },
      ],
    },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'screenshots',
      type: 'array',
      labels: { singular: 'Screenshot', plural: 'Screenshots' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'links',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', localized: true, admin: { width: '40%' } },
            { name: 'url', type: 'text', required: true, admin: { width: '40%' } },
            {
              name: 'type',
              type: 'select',
              defaultValue: 'website',
              admin: { width: '20%' },
              options: [
                { label: 'Website', value: 'website' },
                { label: 'App Store', value: 'appstore' },
                { label: 'Google Play', value: 'playstore' },
                { label: 'Mac App Store', value: 'macappstore' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
