import js from '@eslint/js'
import globals from 'globals'
import boundaries from 'eslint-plugin-boundaries'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const layer = (type) => ({ element: { type } })
const layers = (...types) => ({ to: { element: { types: { anyOf: types } } } })

export default defineConfig([
  globalIgnores(['dist', 'src/shared/api/schema.d.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      // Rezolvă aliasul "@/" din tsconfig.app.json pentru regulile boundaries.
      'import/resolver': {
        typescript: { project: './tsconfig.app.json' },
      },
      'boundaries/dependency-nodes': ['import', 'dynamic-import', 'export'],
      // Ordinea contează: primul descriptor care se potrivește câștigă.
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app', partialMatch: false },
        {
          type: 'feature',
          pattern: 'src/features/*',
          capture: ['feature'],
          partialMatch: false,
        },
        { type: 'shared-ui', pattern: 'src/shared/ui', partialMatch: false },
        { type: 'shared-api', pattern: 'src/shared/api', partialMatch: false },
        { type: 'shared', pattern: 'src/shared', partialMatch: false },
      ],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          message:
            'Arhitectură: „{{from.type}}” nu are voie să importe din „{{to.type}}”. Vezi docs/arhitectura.md.',
          policies: [
            {
              from: layer('app'),
              allow: layers(
                'app',
                'feature',
                'shared-ui',
                'shared-api',
                'shared',
              ),
            },
            {
              from: layer('feature'),
              allow: layers('feature', 'shared', 'shared-ui', 'shared-api'),
            },
            {
              from: layer('shared-ui'),
              allow: layers('shared-ui', 'shared'),
            },
            {
              from: layer('shared-api'),
              allow: layers('shared-api', 'shared'),
            },
            {
              from: layer('shared'),
              allow: layers('shared'),
            },
            // Prinde și căile relative către interiorul altui feature.
            {
              disallow: {
                to: {
                  element: { type: 'feature', fileInternalPath: '!index.ts' },
                },
              },
              message:
                'Un feature se importă doar prin index.ts-ul lui, nu prin fișierele interne („{{to.fileInternalPath}}”).',
            },
          ],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'firebase',
              message:
                'Firebase se importă doar din "firebase/app" și "firebase/auth".',
            },
          ],
          patterns: [
            {
              group: ['firebase/*', '!firebase/app', '!firebase/auth'],
              message:
                'Firebase se importă doar din "firebase/app" și "firebase/auth" (niciodată din "firebase/firestore").',
            },
            {
              group: ['@/features/*/*'],
              message:
                'Un feature se importă doar prin index.ts-ul lui: "@/features/<nume>". În interiorul aceluiași feature folosește căi relative.',
            },
          ],
        },
      ],
    },
  },
])
