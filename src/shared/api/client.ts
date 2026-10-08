import createClient from 'openapi-fetch'
import { env } from '@/shared/config/env'

// Netipizat deocamdată: tipul `paths` vine din schema.d.ts, generat cu `npm run api:gen`.
export const apiClient = createClient({ baseUrl: env.VITE_API_URL })
