# CLAUDE.md

Ghid pentru Claude Code în acest repo. Se încarcă la fiecare sesiune; detaliile stau în `docs/`.

## Proiect

Frontend React pentru SalvamLabute, platformă de adopții și donații verificate, exclusiv în limba română.
Backend-ul este separat (.NET) și nu se află în acest repo.

## Stack

Vite, React, TypeScript strict, React Router, TanStack Query, openapi-fetch, Zod, React Hook Form,
Firebase (doar Auth), date-fns. Node 24 (`.nvmrc`), cu npm-ul livrat cu Node.

## Reguli permanente

- Fără bibliotecă de i18n; textele sunt scrise direct în română.
- Firebase se importă doar din `"firebase/app"` și `"firebase/auth"`.
- Un feature se importă doar prin `index.ts`-ul lui (`@/features/<nume>`); în interiorul lui, căi relative.
- `shared/ui` nu face fetch și nu importă din `features` sau din `shared/api`.
- Sumele de bani vin în unități minore și se formatează printr-o singură funcție din `shared/lib`.
- Nu instala `openapi-typescript` în proiect; se rulează prin `npx`.
- Interzis: `npm audit fix --force`, `--force`, `--legacy-peer-deps`. La conflict de dependențe
  te oprești și îmi explici.
- Windows: fără `&&` în comenzi.

## Comenzi

- `npm run dev` — server de dezvoltare Vite
- `npm run build` — `tsc -b`, apoi `vite build` (singurul pas de verificare a tipurilor)
- `npm run lint` — ESLint, inclusiv regulile de arhitectură și interdicția Firebase
- `npm run preview` — servește `dist/`
- `npm run format` — Prettier pe tot repo-ul
- `npm run api:gen` — generează `src/shared/api/schema.d.ts` prin `npx`; `PORT` din script e placeholder (vezi `README.md`)

Aliasul `@/` înseamnă `src/`. Aplicația cere `.env.local` complet (vezi `.env.example`).
Nu există test runner configurat.

## Documentație

- `docs/stare-implementare.md` — ce există efectiv acum, ce urmează, ce a fost verificat prin rulare
- `docs/decizii.md` — jurnal de decizii (Data / Decizie / Motiv / Consecințe), cele mai noi primele
- `docs/arhitectura.md` — structura de foldere și regulile de import între straturi (impuse de lint)
- `docs/contract-backend.md` — rezumatul contractului cu backend-ul (auth, onboarding, erori, bani)

## Regula de mentenanță

La finalul oricărui task, înainte de commit:

1. actualizezi `docs/stare-implementare.md`;
2. dacă ai luat o decizie nouă, o adaugi în `docs/decizii.md`.

Documentația se commitează în același commit cu codul. Un task nu e terminat până nu e documentat.

## De clarificat

- Portul backend-ului local pentru `api:gen` (vezi `docs/stare-implementare.md`).
