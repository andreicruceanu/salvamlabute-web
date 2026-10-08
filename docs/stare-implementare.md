# Stare implementare

Ce există efectiv în repo, nu ce e planificat. Se actualizează la finalul fiecărui task, înainte de commit.

Ultima actualizare: 2026-10-08.

## Făcut

| Data | Element |
| --- | --- |
| 2026-10-08 | Proiect Vite + React + TypeScript creat (commit `e78e237`). Codul din `src/` este încă template-ul nemodificat. |
| 2026-10-08 | Dependențe instalate (commit `2351ece`): react-router, @tanstack/react-query, openapi-fetch, zod, react-hook-form, @hookform/resolvers, firebase, date-fns; pentru dezvoltare: prettier, eslint-plugin-boundaries, eslint-import-resolver-typescript. Niciuna nu e importată încă în cod. |
| 2026-10-08 | `.nvmrc` cu valoarea `24`. |
| 2026-10-08 | `allowScripts` în `package.json`: aprobat doar `unrs-resolver@1.12.2`. |
| 2026-10-08 | Documentația proiectului: `CLAUDE.md` și `docs/` (acest fișier, `decizii.md`, `arhitectura.md`, `contract-backend.md`). |

Commituri existente înainte de documentație (`git log --oneline`):

```
2351ece Add dependencies
e78e237 Initial Vite + React + TS
```

## În lucru

Nimic.

## De făcut, în ordine

1. Structura de foldere și regulile de import (vezi `arhitectura.md`).
2. Client API și sesiune.
3. Login Google, onboarding și `/users/me`.
4. Tokens și componente din design.
5. Restul paginilor.

## Decizii luate, dar neaplicate încă în cod

- `index.html` are încă `<html lang="en">`; decizia este `lang="ro"`.
- Constanta `LOCALE = 'ro-RO'` nu există încă.
- `eslint-plugin-boundaries` și `eslint-import-resolver-typescript` sunt instalate, dar nu apar în `eslint.config.js`.
- `README.md` este încă README-ul template-ului Vite.
- Nu există scripturile `format` și `api:gen` și nici fișier de configurare Prettier.

## Verificat

Dovedit prin rulare la 2026-10-08, pe Node v24.20.0 și npm 11.19.0, pe codul template-ului:

| Ce | Rezultat |
| --- | --- |
| `npm run build` | Reușit: `tsc -b` fără erori, `vite build` (Vite 8.3.3) a transformat 20 de module. |
| `npm run lint` | Reușit, fără erori și fără avertismente. Atenție: rulează configurația ESLint a template-ului, fără reguli de boundaries. |
| Server de dezvoltare | Pornit pe un port de test; `/` și `/src/main.tsx` au răspuns cu HTTP 200. Pagina nu a fost deschisă într-un browser. |
| `npm audit` | 8 vulnerabilități `high`, pe lanțurile descrise în `decizii.md`. Mesajul lui `npm audit fix --force` confirmă downgrade-ul la `firebase@9.14.0` și `eslint-plugin-boundaries@1.1.1`. |
| Cerința de Node a Firebase | `@firebase/app` și `@firebase/auth` declară `engines.node >= 24.12.0`. |

Nedovedit:

- Rezolvarea importurilor prin resolverul TypeScript (`eslint-import-resolver-typescript`) — nedovedit, nu e configurat.
- Regulile `eslint-plugin-boundaries` — nedovedit, nu sunt scrise.
- Absența `@grpc/grpc-js` din bundle-ul de producție — nedovedit în sens util: bundle-ul actual nu importă deloc Firebase. De reconfirmat după ce există cod Firebase.
- Conflictul ERESOLVE dintre `openapi-typescript` 7.13 și TypeScript 6 — nu a fost reprodus în această sesiune; e preluat din `decizii.md`.
- Generarea tipurilor prin `npx openapi-typescript` — nedovedit, nu a fost rulată.
- Formatarea cu Prettier — nedovedit, nu a fost rulată.
- Teste — nu există test runner.
- Orice apel către backend — nedovedit, nu există cod de client API.

## De clarificat

- Comanda exactă pentru `api:gen`: versiunea fixată de `openapi-typescript`, sursa schemei OpenAPI (URL sau fișier) și fișierul de ieșire.
- Comanda și configurația pentru `format` (opțiunile Prettier).
- Ce test runner se folosește, dacă se folosește unul, și în ce pas intră.
- Dacă `README.md` se rescrie sau se șterge.
