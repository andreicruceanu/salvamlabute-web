# SalvamLabute — frontend

Frontend React pentru SalvamLabute, platformă de adopții și donații verificate. Aplicația este exclusiv în limba română. Backend-ul (.NET) este în alt repo.

Documentația stă în [docs/](docs/); regulile de lucru sunt în [CLAUDE.md](CLAUDE.md).

## Pornire

1. Node 24 (vezi `.nvmrc`), minimum 24.12.
2. `npm install`
3. Copiază `.env.example` în `.env.local` și completează toate valorile. Aplicația nu pornește dacă lipsește vreuna.
4. `npm run dev`

## Comenzi

| Comandă           | Ce face                                            |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | server de dezvoltare                               |
| `npm run build`   | verificare de tipuri (`tsc -b`) și build           |
| `npm run lint`    | ESLint, inclusiv regulile de arhitectură           |
| `npm run format`  | Prettier pe tot repo-ul                            |
| `npm run api:gen` | generează `src/shared/api/schema.d.ts` din OpenAPI |

## Generarea tipurilor API

`npm run api:gen` rulează `openapi-typescript@7.13.0` prin `npx` (nu se instalează în proiect, pentru că cere TypeScript 5) și citește schema de la backend-ul pornit local.

<!--
  PORT: scriptul `api:gen` din package.json conține literal `http://localhost:PORT/openapi/v1.json`.
  Înlocuiește PORT cu portul HTTP al backend-ului local înainte de prima rulare.
  În repo-ul backend-ului, profilul `http` din launchSettings.json folosește 5166 (nevalidat prin rulare).
-->

Până când `PORT` nu este înlocuit în `package.json`, comanda eșuează.
