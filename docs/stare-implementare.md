# Stare implementare

Ce există efectiv în repo, nu ce e planificat. Se actualizează la finalul fiecărui task, înainte de commit.

Ultima actualizare: 2026-10-08.

## Făcut

| Data       | Element                                                                                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-08 | Proiect Vite + React + TypeScript creat (commit `e78e237`).                                                                                                                                         |
| 2026-10-08 | Dependențe instalate (commit `2351ece`).                                                                                                                                                            |
| 2026-10-08 | `.nvmrc` cu valoarea `24`; `allowScripts` aprobat doar pentru `unrs-resolver@1.12.2`.                                                                                                               |
| 2026-10-08 | Documentația proiectului: `CLAUDE.md` și `docs/` (commit `40e3f42`).                                                                                                                                |
| 2026-10-08 | Tooling: `noUncheckedIndexedAccess`, aliasul `@/` → `src/` (tsconfig, Vite, ESLint), `.prettierrc` și scriptul `format`, `.env.local` în `.gitignore`, `<html lang="ro">` și titlul „SalvamLabute". |
| 2026-10-08 | Conținutul demo al template-ului șters (`App.tsx`, `App.css`, `index.css`, `src/assets/`, `public/icons.svg`).                                                                                      |
| 2026-10-08 | Structura `app` / `features` / `shared` (vezi `arhitectura.md`). Feature-urile `auth`, `onboarding`, `users` există doar ca schelet: `index.ts` gol și foldere goale.                               |
| 2026-10-08 | `shared/config/locale.ts` (`LOCALE = 'ro-RO'`) și `shared/config/env.ts` (variabilele de mediu validate cu Zod la pornire). `.env.example` cu toate cheile.                                         |
| 2026-10-08 | `app/providers.tsx` (QueryClientProvider + RouterProvider) și `app/router.tsx` cu o singură rută, `/`, care afișează „SalvamLabute".                                                                |
| 2026-10-08 | `shared/api/client.ts`: client `openapi-fetch` netipizat, cu `baseUrl` din `VITE_API_URL`. Nu e folosit nicăieri încă.                                                                              |
| 2026-10-08 | Regulile de arhitectură în ESLint (`eslint-plugin-boundaries`) și interdicția Firebase (`no-restricted-imports`), cu mesaje în română.                                                              |
| 2026-10-08 | Scriptul `api:gen`, cu portul lăsat ca placeholder `PORT`. `README.md` rescris în română.                                                                                                           |

## În lucru

Nimic.

## De făcut, în ordine

1. ~~Structura și regulile de import~~ — făcut.
2. Client API și sesiune.
3. Login Google, onboarding și `/users/me`.
4. Tokens și componente din design.
5. Restul paginilor.

## Există, dar e doar schelet

- `shared/api/client.ts` nu are tipuri: `schema.d.ts` nu a fost generat.
- `shared/api/errors/`, `shared/lib/`, `app/layouts/`, `app/guards/` și folderele din feature-uri sunt goale (`.gitkeep`).
- `shared/styles/tokens.css` conține doar un comentariu.
- Firebase nu este inițializat și nu este importat nicăieri.
- `public/favicon.svg` este încă iconița template-ului Vite.

## Verificat

Dovedit prin rulare la 2026-10-08, pe Node v24.20.0 și npm 11.19.0:

| Ce                                                                           | Rezultat                                                                                                                                                                                 |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`                                                              | Reușit: `tsc -b` fără erori, `vite build` a transformat 240 de module.                                                                                                                   |
| `npm run lint`                                                               | Reușit, fără erori și fără avertismente, cu regulile de arhitectură active.                                                                                                              |
| `npm run format`                                                             | Rulat pe tot repo-ul.                                                                                                                                                                    |
| Server de dezvoltare                                                         | Pornit pe un port de test; `/` și `/src/main.tsx` au răspuns cu HTTP 200. Pagina nu a fost deschisă într-un browser.                                                                     |
| `strict` și `noUncheckedIndexedAccess`                                       | Un fișier temporar cu parametru fără tip și cu `arr[0]` folosit ca `string` a dat TS7006 și TS2322.                                                                                      |
| Aliasul `@/` în lint (resolverul TypeScript)                                 | Dovedit: un import `@/shared/api/client` dintr-un fișier din `shared/ui` a fost respins de `boundaries/dependencies`, deci aliasul e rezolvat până la fișier.                            |
| `shared-ui` → `shared-api`                                                   | Respins.                                                                                                                                                                                 |
| `shared-api` → `shared-ui`                                                   | Respins.                                                                                                                                                                                 |
| `shared-ui` → `shared`, `shared-api` → `shared`                              | Acceptate.                                                                                                                                                                               |
| Import în interiorul altui feature                                           | Respins și cu alias (`@/features/auth/api/ceva`), și relativ (`../auth/api/ceva`).                                                                                                       |
| Import al unui feature prin `index.ts` și import relativ în propriul feature | Acceptate.                                                                                                                                                                               |
| `firebase` și `firebase/firestore`                                           | Respinse; `firebase/auth` acceptat.                                                                                                                                                      |
| Validarea variabilelor de mediu                                              | Modulul `env.ts`, încărcat prin Vite: fără `.env.local`, cu o cheie lipsă și cu valori greșite a aruncat eroarea în română care numește cheile; cu toate cheile completate s-a încărcat. |
| `npm audit`                                                                  | 8 vulnerabilități `high`, pe lanțurile descrise în `decizii.md`.                                                                                                                         |
| Cerința de Node a Firebase                                                   | `@firebase/app` și `@firebase/auth` declară `engines.node >= 24.12.0`.                                                                                                                   |

Toate fișierele temporare folosite la aceste probe au fost șterse.

Nedovedit:

- Aplicația într-un browser real: pagina „SalvamLabute" și eroarea de configurare nu au fost văzute în browser, doar prin rulare în Node.
- `npm run api:gen` — nerulat; conține placeholderul `PORT`, iar backend-ul nu a fost pornit.
- Dacă scriptul de instalare al `unrs-resolver` era necesar: resolverul funcționează, iar binarul nativ vine din pachetul opțional `@unrs/resolver-binding-win32-x64-msvc`, dar nu s-a făcut o instalare curată fără aprobarea scriptului.
- Absența `@grpc/grpc-js` din bundle-ul de producție — bundle-ul actual nu importă deloc Firebase. De reconfirmat după ce există cod Firebase.
- Conflictul ERESOLVE dintre `openapi-typescript` 7.13 și TypeScript 6 — nereprodus în sesiunile de lucru; preluat din `decizii.md`.
- Teste — nu există test runner.
- Orice apel către backend.

## De clarificat

- Portul backend-ului local pentru `api:gen` (în repo-ul backend-ului, profilul `http` folosește 5166).
- Dacă lista de chei `VITE_FIREBASE_*` este cea corectă (vezi D-009 în `decizii.md`).
- Ce test runner se folosește, dacă se folosește unul, și în ce pas intră.
- Dacă `public/favicon.svg` se înlocuiește acum sau la pasul 4.
