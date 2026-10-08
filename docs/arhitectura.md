# Arhitectură

> **ȚINTĂ — se aplică după pasul 1** din `stare-implementare.md`.
> Nimic din acest fișier nu este implementat încă. Azi `src/` conține doar template-ul Vite
> (`main.tsx`, `App.tsx`), iar regulile de import de mai jos nu sunt verificate de ESLint.

## Structura de foldere țintă

```
src/
  app/
  features/
    <feature>/
      index.ts
  shared/
    ui/
    api/
    lib/
    styles/
    config/
```

Ce se știe sigur despre fiecare loc:

| Loc | Ce se știe |
| --- | --- |
| `features/<feature>` | Se expune doar prin `index.ts`-ul lui. |
| `shared/ui` | Componente care nu fac fetch. |
| `shared/api` | Clientul API. Parserul unic de erori stă în `shared/api/errors` (vezi `contract-backend.md`). |
| `shared/lib` | Conține funcția unică de formatare a sumelor de bani. |
| `app`, `shared/styles`, `shared/config` | Conținutul exact e de clarificat. |

## Reguli de dependență între straturi

Reguli stabilite:

1. Un feature se importă doar prin `index.ts`-ul lui, niciodată prin fișierele lui interne.
2. `shared/ui` nu importă din `features`.
3. `shared/ui` nu importă din `shared/api` și nu face fetch.
4. Firebase se importă doar din `"firebase/app"` și `"firebase/auth"`.

Tabelul complet (rândul importă din coloană). „Da" și „Nu" apar doar unde regula a fost stabilită; restul celulelor sunt de clarificat și nu trebuie presupuse.

| Importă ↓ / din → | `app` | `features` | `shared/ui` | `shared/api` | `shared/lib` | `shared/styles` | `shared/config` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `app` | — | ? (doar prin `index.ts`) | ? | ? | ? | ? | ? |
| `features/<feature>` | ? | alt feature: ? (doar prin `index.ts`) | ? | ? | ? | ? | ? |
| `shared/ui` | ? | **Nu** | — | **Nu** | ? | ? | ? |
| `shared/api` | ? | ? | ? | — | ? | ? | ? |
| `shared/lib` | ? | ? | ? | ? | — | ? | ? |
| `shared/styles` | ? | ? | ? | ? | ? | — | ? |
| `shared/config` | ? | ? | ? | ? | ? | ? | — |

Regulile urmează să fie impuse cu `eslint-plugin-boundaries` (instalat, neconfigurat).

## Cum se adaugă un feature nou

1. Creezi folderul `src/features/<nume>/`.
2. Creezi `src/features/<nume>/index.ts` și exporți din el doar ce trebuie folosit din afară.
3. Din afara feature-ului imporți numai din acel `index.ts`.
4. Componentele reutilizabile fără date merg în `shared/ui`, nu în feature.
5. Actualizezi `stare-implementare.md` în același commit.

## De clarificat

- Toate celulele marcate cu „?" din tabel. În special: dacă un feature poate importa alt feature, dacă `shared` poate importa din `app` sau `features` (în afară de `shared/ui`, unde e interzis), și ce își pot importa între ele subfolderele din `shared`.
- Ce conține `app` (rute, provideri, layout?) și ce conțin `shared/styles` și `shared/config`.
- Structura internă a unui feature (subfoldere, convenții de nume).
- Dacă se folosesc aliasuri de import (de exemplu `@/`); azi nu există niciunul în `tsconfig.app.json` sau `vite.config.ts`.
- Unde stă modulul unic de sesiune și unde stă codul Firebase.
