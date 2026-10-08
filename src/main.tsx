import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/config/env'
import '@/shared/styles/reset.css'
import '@/shared/styles/tokens.css'
import { Providers } from '@/app/providers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
)
