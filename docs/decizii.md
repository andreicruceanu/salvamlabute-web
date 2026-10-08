# Jurnal de decizii

Cele mai noi primele. Format fix pentru fiecare intrare: Data / Decizie / Motiv / Consecințe.

Intrările D-001 – D-006 sunt intrările de pornire, consemnate la 2026-10-08, ziua în care a fost creat proiectul.

---

## D-006 — Aplicația este doar în română

- **Data:** 2026-10-08
- **Decizie:** Fără bibliotecă de i18n. Textele sunt scrise direct în română. `LOCALE = 'ro-RO'`, `<html lang="ro">`.
- **Motiv:** Platforma este exclusiv în limba română.
- **Consecințe:** Nu există fișiere de traduceri și nici chei de text. Formatările de dată, număr și bani folosesc `ro-RO`. Neaplicat încă în cod: `index.html` are `lang="en"`, iar constanta `LOCALE` nu există (vezi `stare-implementare.md`).

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
- **Consecințe:** Tipurile API se generează printr-o comandă `npx`. Scriptul `api:gen` nu există încă. Conflictul nu se ocolește cu `--force` sau `--legacy-peer-deps`.

---

## De clarificat

- D-005: motivul pentru care s-a ales ESLint în locul oxlint.
- D-001: versiunea exactă de `openapi-typescript` care se fixează în comanda `npx`.
- D-002: dacă minimul `24.12` trebuie impus explicit (de exemplu prin `engines` în `package.json`) sau rămâne doar `.nvmrc`.
