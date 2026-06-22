import config from '@payload-config'
import { getPayload } from 'payload'

/** Cached Payload local-API client for use in Server Components and route handlers. */
export const getPayloadClient = async () => getPayload({ config })
