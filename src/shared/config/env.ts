import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.url(),
  VITE_FIREBASE_API_KEY: z.string().min(1),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1),
  VITE_FIREBASE_APP_ID: z.string().min(1),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  const keys = [
    ...new Set(parsed.error.issues.map((issue) => issue.path.join('.'))),
  ]

  throw new Error(
    `Configurare invalidă: variabilele de mediu ${keys.join(', ')} lipsesc sau sunt greșite. ` +
      'Completează-le în .env.local (vezi .env.example).',
  )
}

export const env = parsed.data
