# Jurnal de decizii

Cele mai noi primele. Format fix pentru fiecare intrare: Data / Decizie / Motiv / Consecințe.

Intrările D-001 – D-006 sunt intrările de pornire, consemnate la 2026-10-08, ziua în care a fost creat proiectul.

---

## D-010 — Portul din api:gen rămâne placeholder

- **Data:** 2026-10-08
- **Decizie:** Scriptul `api:gen` conține literal `http://localhost:PORT/openapi/v1.json`. Portul real se completează manual, o singură dată; nota stă comentată în `README.md`.
- **Motiv:** Portul backend-ului local nu a fost confirmat prin rulare.
- **Consecințe:** `npm run api:gen` eșuează până când `PORT` este înlocuit. `src/shared/api/schema.d.ts` nu există încă și este exclus din ESLint.

## D-009 — Variabilele de mediu se validează cu Zod la pornire

- **Data:** 2026-10-08
- **Decizie:** `shared/config/env.ts` validează `VITE_API_URL` (URL valid) și `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID` (nevide). `main.tsx` importă modulul primul.
- **Motiv:** O cheie lipsă trebuie să dea o eroare clară la pornire, nu `undefined` la prima folosire.
- **Consecințe:** Fără `.env.local` complet, aplicația nu pornește: aruncă o eroare în română care numește cheile. Cele patru chei Firebase au fost alese ca set minim pentru Auth; cerința spunea doar `VITE_FIREBASE_*`, deci lista e de confirmat. Restul codului citește configurarea din `env`, nu din `import.meta.env`.

## D-008 — Lintul interzice orice import Firebase în afară de app și auth

- **Data:** 2026-10-08
- **Decizie:** `no-restricted-imports` respinge `firebase` și orice `firebase/*`, cu excepția `firebase/app` și `firebase/auth`.
- **Motiv:** Cerința era interzicerea lui `firebase` și `firebase/firestore`. Regula scrisă e mai largă, ca să aplice exact regula permanentă „doar `firebase/app` și `firebase/auth`" și să țină `@grpc/grpc-js` în afara bundle-ului (vezi D-003).
- **Consecințe:** Pentru orice alt produs Firebase (Storage, Messaging etc.) trebuie schimbată regula din `eslint.config.js` și consemnată o decizie nouă.

## D-007 — Regulile de arhitectură se impun cu eslint-plugin-boundaries 7

- **Data:** 2026-10-08
- **Decizie:** Straturile `app`, `feature`, `shared-ui`, `shared-api`, `shared` și regulile dintre ele sunt definite în `eslint.config.js`, cu regula `boundaries/dependencies` (implicit `disallow`). Tabelul complet este în `arhitectura.md`.
- **Motiv:** Regulile de import trebuie verificate automat, nu ținute minte.
- **Consecințe:**
  - Sintaxa folosită este cea din versiunea 7 instalată (`policies`, selectori `{ element: { type } }`, `partialMatch: false`), citită din tipurile din `node_modules`; `element-types` și `rules` sunt marcate ca depreciate acolo.
  - Aliasul `@/` este rezolvat prin `import/resolver` → `typescript`, care citește `tsconfig.app.json`.
  - `shared-api` nu are voie să importe din `shared-ui` (și invers).
  - Intrarea unică a unui feature este impusă de două ori: `no-restricted-imports` pe tiparul `@/features/*/*` și o politică boundaries care prinde și căile relative. De aceea, în interiorul unui feature se folosesc doar căi relative.
  - `src/main.tsx` nu aparține niciunui strat și nu este verificat.
  - Se verifică `import`, `import()` dinamic și `export ... from`.

## D-006 — Aplicația este doar în română

- **Data:** 2026-10-08
- **Decizie:** Fără bibliotecă de i18n. Textele sunt scrise direct în română. `LOCALE = 'ro-RO'`, `<html lang="ro">`.
- **Motiv:** Platforma este exclusiv în limba română.
- **Consecințe:** Nu există fișiere de traduceri și nici chei de text. Formatările de dată, număr și bani folosesc `ro-RO`. Aplicat: `index.html` are `lang="ro"`, iar `LOCALE` este în `src/shared/config/locale.ts`.

## D-005 — Scaffold regenerat cu ESLint în loc de oxlint

- **Data:** 2026-10-08
- **Decizie:** La crearea proiectului, scaffold-ul a fost regenerat cu ESLint în loc de oxlint.
- **Motiv:** De clarificat (motivul nu a fost consemnat).
- **Consecințe:** Lintingul se face cu ESLint (`eslint.config.js`, `npm run lint`).

## D-004 — Scripturi de instalare aprobate doar pentru unrs-resolver

- **Data:** 2026-10-08
- **Decizie:** În `allowScripts` este aprobat doar `unrs-resolver@1.12.2`. `@firebase/util` și `protobufjs` rămân neaprobate.
- **Motiv:** Nu avem nevoie de scripturile de instalare ale `@firebase/util` și `protobufjs`.
- **Consecințe:** La instalare, npm semnalează scripturile neaprobate; nu se aprobă fără o decizie nouă în acest jurnal. Aprobarea e legată de versiunea `1.12.2`.

## D-003 — Vulnerabilitățile din npm audit (8, high) nu se repară

- **Data:** 2026-10-08
- **Decizie:** Cele 8 vulnerabilități `high` raportate de `npm audit` rămân nereparate. `npm audit fix --force` este respins.
- **Motiv:**
  - `braces`, prin `eslint-plugin-boundaries` → `@boundaries/elements` → `micromatch`: doar dezvoltare, nu ajunge în browser.
  - `@grpc/grpc-js`, prin `firebase` → `@firebase/firestore`: nefolosit, pentru că importăm doar `firebase/app` și `firebase/auth`.
  - `npm audit fix --force` ar face downgrade la `firebase@9.14.0` și `eslint-plugin-boundaries@1.1.1`.
- **Consecințe:** `npm audit` raportează în continuare 8 `high`. Firebase se importă doar din `firebase/app` și `firebase/auth`. De reconfirmat după ce există cod Firebase: bundle-ul de producție nu trebuie să conțină grpc. Interzise: `npm audit fix --force`, `--force`, `--legacy-peer-deps`.

## D-002 — Node 24

- **Data:** 2026-10-08
- **Decizie:** Proiectul rulează pe Node 24. Fișierul `.nvmrc` conține `24`. Se folosește npm-ul livrat cu Node, nu se actualizează separat.
- **Motiv:** Firebase 13 cere Node `>= 24.12`.
- **Consecințe:** O versiune de Node mai veche de 24.12 nu respectă cerința Firebase. `.nvmrc` fixează doar versiunea majoră, nu și minimul `24.12`.

## D-001 — openapi-typescript nu se instalează în proiect

- **Data:** 2026-10-08
- **Decizie:** `openapi-typescript` nu se adaugă în `package.json`. Se rulează prin `npx`, cu versiune fixată.
- **Motiv:** Template-ul vine cu TypeScript 6, iar `openapi-typescript` 7.13 acceptă doar TypeScript 5 (ERESOLVE la instalare).
- **Consecințe:** Tipurile API se generează cu `npm run api:gen`, care rulează `npx -y openapi-typescript@7.13.0`. Conflictul nu se ocolește cu `--force` sau `--legacy-peer-deps`.

---

## De clarificat

- D-005: motivul pentru care s-a ales ESLint în locul oxlint.
- D-009: dacă lista de chei `VITE_FIREBASE_*` este cea corectă.
- D-010: portul backend-ului local.
- D-002: dacă minimul `24.12` trebuie impus explicit (de exemplu prin `engines` în `package.json`) sau rămâne doar `.nvmrc`.
