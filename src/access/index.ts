import type { Access, FieldAccess } from 'payload'

// Central access rules. Two roles: `admin` manages users, settings and the seed;
// `redaktion` edits content. Anonymous visitors only ever see published documents.
// Note: the Local API bypasses access by default (overrideAccess: true) — frontend
// queries filter on `_status` themselves.

type RoleUser = { role?: 'admin' | 'redaktion' | null } | null | undefined

export const hasRole = (user: RoleUser, role: 'admin' | 'redaktion'): boolean =>
  Boolean(user && user.role === role)

export const anyone: Access = () => true

export const isAdmin: Access = ({ req: { user } }) => hasRole(user as RoleUser, 'admin')

/** Admin or Redaktion — anyone with a login may edit content. */
export const isEditor: Access = ({ req: { user } }) => Boolean(user)

export const publishedOrLoggedIn: Access = ({ req: { user } }) =>
  user ? true : { _status: { equals: 'published' } }

export const loggedInField: FieldAccess = ({ req: { user } }) => Boolean(user)

export const adminField: FieldAccess = ({ req: { user } }) => hasRole(user as RoleUser, 'admin')

/** Standard access block for editorial collections with drafts. */
export const editorialAccess = {
  read: publishedOrLoggedIn,
  create: isEditor,
  update: isEditor,
  delete: isEditor,
}

/** Standard access block for editorial collections without drafts. */
export const publicReadAccess = {
  read: anyone,
  create: isEditor,
  update: isEditor,
  delete: isEditor,
}
