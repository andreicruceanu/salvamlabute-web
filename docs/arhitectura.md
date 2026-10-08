# Arhitectură

Structura și regulile de mai jos sunt implementate (pasul 1) și verificate de `npm run lint`.

## Structura de foldere

```
src/
  main.tsx          punctul de intrare
  app/              providers.tsx, router.tsx, layouts/, guards/
  features/
    auth/           api/, components/, pages/, index.ts
    onboarding/     api/, components/, pages/, index.ts
    users/          api/, components/, pages/, index.ts
  shared/
    ui/             componente prezentaționale
    api/            client.ts, errors/
    lib/
    styles/         tokens.css, reset.css
    config/         env.ts, locale.ts
```

Nu există `components/`, `hooks/` sau `utils/` în rădăcina `src/`.

Folderele încă goale conțin un fișier `.gitkeep`; se șterge când apare primul fișier real.

## Straturi

Regulile sunt definite în `eslint.config.js`, cu `eslint-plugin-boundaries`.

| Strat        | Fișiere                                                |
| ------------ | ------------------------------------------------------ |
| `app`        | `src/app/**`                                           |
| `feature`    | `src/features/<nume>/**`                               |
| `shared-ui`  | `src/shared/ui/**`                                     |
| `shared-api` | `src/shared/api/**`                                    |
| `shared`     | restul din `src/shared/**` (`lib`, `styles`, `config`) |

`src/main.tsx` nu aparține niciunui strat, deci importurile lui nu sunt verificate.

## Reguli de dependență

Rândul importă din coloană.

| Importă ↓ / din → | `app` | `feature` | `shared-ui` | `shared-api` | `shared` |
| ----------------- | ----- | --------- | ----------- | ------------ | -------- |
| `app`             | Da    | Da        | Da          | Da           | Da       |
| `feature`         | Nu    | Da        | Da          | Da           | Da       |
| `shared-ui`       | Nu    | Nu        | Da          | **Nu**       | Da       |
| `shared-api`      | Nu    | Nu        | **Nu**      | Da           | Da       |
| `shared`          | Nu    | Nu        | Nu          | Nu           | Da       |

Reguli suplimentare:

1. Un feature se importă doar prin `index.ts`-ul lui: `@/features/<nume>`. Orice import către un fișier intern al altui feature pică la lint, fie că e scris cu alias (`@/features/auth/api/x`), fie relativ (`../auth/api/x`). Regula se aplică și stratului `app`.
2. În interiorul aceluiași feature se folosesc căi relative (`./api/x`). Aliasul `@/features/<nume>/...` este interzis peste tot, inclusiv în feature-ul propriu.
3. Firebase se importă doar din `"firebase/app"` și `"firebase/auth"`. `"firebase"` și orice alt `"firebase/*"` pică la lint.
4. `shared/ui` nu face fetch (regulă de disciplină; lintul verifică doar importurile).

## Aliasul `@/`

`@/` înseamnă `src/`. Este definit în trei locuri care trebuie ținute sincronizate:

- `tsconfig.app.json` (`paths`) — pentru TypeScript;
- `vite.config.ts` (`resolve.alias`) — pentru build și dev;
- `eslint.config.js` (`import/resolver` → `typescript`) — pentru regulile de arhitectură; citește `tsconfig.app.json`.

## Cum se adaugă un feature nou

1. Creezi `src/features/<nume>/` cu `api/`, `components/`, `pages/` și `index.ts`.
2. Exporți din `index.ts` doar ce trebuie folosit din afară.
3. Din afară imporți numai `@/features/<nume>`; în interior folosești căi relative.
4. Componentele reutilizabile fără date merg în `shared/ui`, nu în feature.
5. Rulezi `npm run lint`, apoi actualizezi `stare-implementare.md` în același commit.

Nu e nevoie de nicio schimbare în `eslint.config.js`: orice folder din `src/features/` este automat un `feature`.

## De clarificat

- Dacă un feature are voie să importe orice alt feature (acum da, prin `index.ts`) sau trebuie restrâns.
- Unde stă modulul unic de sesiune și unde stă codul Firebase (`features/auth` sau `shared`).
- Ce conțin `app/layouts` și `app/guards`, concret.
- Dacă fișierele din afara straturilor (în afară de `main.tsx`) trebuie interzise prin lint; acum un folder nou în rădăcina `src/` nu ar fi semnalat.
