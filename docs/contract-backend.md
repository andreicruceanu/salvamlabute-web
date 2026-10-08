# Contract cu backend-ul

> **Rezumat din documentele backend (august 2026); sursa de adevăr e OpenAPI-ul backend-ului, nu acest fișier.**
>
> **Stare verificare (2026-10-08):** comparat cu repo-ul local al backend-ului. Doar două puncte au
> putut fi confirmate în cod; restul este **neverificat față de cod**, pentru că endpoint-urile
> respective nu există încă acolo. Detalii în secțiunea „Verificare față de codul backend-ului".

## Autentificare

- Firebase este singura autoritate de identitate. Nu există parole.
- Există două căi:
  - **Google:** clientul face `signInWithPopup`, apoi trimite ID token-ul la
    `POST /api/v1/auth/google`, în header-ul `Authorization: Bearer` (nu în body).
  - **OTP pe email:** endpoint-uri proprii ale backend-ului. Backend-ul întoarce `idToken` și
    `refreshToken`, iar clientul nu atinge Firebase SDK pe această cale.
- Sesiunea trebuie ținută de **un singur modul**, pe ambele căi.

## Onboarding

- Un singur ecran după autentificare: `PUT /api/v1/users/me/onboarding`, cu nume afișat,
  `termsVersion` și newsletter.
- `profileComplete` este `false` până atunci.
- Cât timp `profileComplete` este `false`, sunt blocate: creare campanie, donație, onboarding
  Stripe, mesaje, publicare anunț. Navigarea și citirea rămân permise.

## Utilizatorul curent

- `GET /api/v1/users/me` se apelează la fiecare reîncărcare de pagină.
- `termsVersion` întors este versiunea **acceptată**. Dacă diferă de cea curentă, se afișează un
  ecran blocant de reacceptare (`PUT /api/v1/users/me/terms`).
- `PUT /api/v1/users/me` nu primește email.

## Date publice

- `GET /api/v1/cities` este public.

## Erori

- RFC 9457 Problem Details.
- Un singur parser, în `shared/api/errors`, cu mesajele din `error-messages.json`.

## Convenții generale

- Rute versionate: `/api/v1`.
- Paginare pe cursor, nu pe offset.
- Bani: unități minore (întreg), cu valută, implicit RON.
- Starea plății vine din webhook. UI-ul poate fi optimist, dar nu este sursa de adevăr.

## Configurare la apariția domeniului

Când apare domeniul frontend-ului, el trebuie adăugat în Firebase → Authorized domains și în
CORS-ul backend-ului.

## Verificare față de codul backend-ului

Făcută la 2026-10-08, față de `C:\Users\User\source\repos\SalvamLabutele` (repo fără niciun commit;
s-au citit fișierele din directorul de lucru). Backend-ul nu a fost pornit; verificarea e doar prin
citirea codului.

Confirmat în cod:

- Rutele au prefixul `api/v1`.
- Erorile sunt RFC 9457, cu tipul de conținut `application/problem+json`. Pe lângă câmpurile
  standard, documentul are extensiile `code` (codul erorii principale) și `errors` (listă de
  obiecte `{ code, message }`). Statusuri folosite: 400 validare, 403, 404, 409 conflict, 500.

Există în cod, dar lipsește din rezumat:

- `POST /api/v1/users`, cu `firebaseUid`, `email` și `displayName` în body; întoarce 201 cu `id`.
  Coduri de conflict: `user.email_already_exists`, `user.firebase_uid_already_exists`.
  Este singurul endpoint din repo.

Neverificat față de cod (nu există în repo-ul local):

- Orice autentificare: `POST /api/v1/auth/google`, endpoint-urile OTP, validarea token-ului.
- `GET` / `PUT /api/v1/users/me`, onboarding, termeni. Entitatea `User` are doar `Id`,
  `FirebaseUid`, `Email`, `DisplayName`, `CreatedAtUtc`; nu are `profileComplete`, `termsVersion`
  sau newsletter.
- `GET /api/v1/cities`.
- Paginarea pe cursor, reprezentarea banilor, plățile și webhook-ul.
- CORS (nu e configurat în `Program.cs`).
- `error-messages.json` (nu există în repo-ul backend-ului).

## De clarificat

- Dacă `C:\Users\User\source\repos\SalvamLabutele` este backend-ul la care se referă documentele
  din august 2026 sau există o versiune mai avansată în altă parte.
- Rolul lui `POST /api/v1/users` (primește `firebaseUid` în body) față de fluxul din rezumat, în
  care identitatea vine din token.
- Endpoint-urile OTP: rute, body-uri, răspunsuri.
- Cum se reîmprospătează sesiunea pe calea OTP cu `refreshToken`, dacă clientul nu atinge Firebase SDK.
- De unde află frontend-ul versiunea **curentă** a termenilor, cu care compară `termsVersion`.
- Unde stă `error-messages.json`, cine îl întreține și dacă cheile lui sunt valorile din extensia `code`.
- Forma exactă a paginării (numele câmpurilor de cursor) și a sumelor de bani (numele câmpurilor).
- URL-ul de bază al API-ului pe medii și locul din care se ia schema OpenAPI pentru generarea tipurilor.
