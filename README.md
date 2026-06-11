# DistInc Data Microservice

A strict TypeScript and Firebase Cloud Functions service that validates, stores, and retrieves the financial records used by the DistInc personal finance platform.

## Links

| Resource | Link |
|---|---|
| Live application | [distinc.co.uk](https://www.distinc.co.uk) |
| Demo video | [Watch on YouTube](https://youtu.be/xbIUeWg9SuI) |
| Public API entry point | [DistInc API Gateway](https://github.com/SaoodCS/DistInc-API-Gateway) |
| React PWA | [DistInc Frontend](https://github.com/SaoodCS/DistInc-PWA-React-TypeScript-Front-End) |
| User service | [DistInc User Microservice](https://github.com/SaoodCS/DistInc-User-Microservice) |
| Notification service | [DistInc Notification Microservice](https://github.com/SaoodCS/DistInc-Notification-Microservice) |

## Tech Stack

| Area | Technology | Purpose |
|---|---|---|
| Runtime | Node.js 20, TypeScript 5.4 | Strictly typed server-side implementation |
| API | Express, Firebase Cloud Functions | HTTP routing and serverless execution |
| Persistence | Cloud Firestore, Firebase Admin SDK | Per-user financial data storage |
| Authentication | Firebase Authentication | ID-token verification and user-scoped access |
| Testing | Jest, `ts-jest` | TypeScript unit tests |
| Quality | ESLint, Prettier, TypeScript | Static analysis, formatting, and type checking |
| Delivery | GitHub Actions, Firebase CLI | Branch-based CI/CD to development and production |

## Key Features

- Manages savings, current, and credit account records through dedicated create/update, read, and delete operations.
- Persists income and expense records in user-scoped Firestore documents.
- Stores distribution steps, monthly analytics, and tracked savings-account history.
- Updates tracked savings history when a savings account balance is recorded.
- Supports deleting individual calculation records, all records for a month, or history for a selected savings account.
- Validates request bodies with TypeScript type guards before performing Firestore writes.
- Resolves the current user from a verified Firebase ID token instead of accepting a client-supplied user ID.
- Protects deployed service-to-service requests with a shared API key and centralized error responses.

## Getting Started

### Prerequisites

- Node.js 20
- npm
- Firebase CLI 13.7.2 for emulation or deployment
- Access to a Firebase project with Authentication and Firestore configured

The repository uses `package-lock.json`, so npm is the supported package manager.

```bash
git clone https://github.com/SaoodCS/Distinc-Data-Microservice.git
cd Distinc-Data-Microservice
npm install
```

The root install script installs dependencies in `functions/`, where the Cloud Function package is located.

### Environment

Environment files are gitignored, and the repository does not currently include a `.env.example`. Create `functions/.env` with the same internal key configured in the API gateway:

```dotenv
API_KEY=replace-with-shared-gateway-key
```

Firebase Admin uses the active Firebase project or `GOOGLE_APPLICATION_CREDENTIALS`. Deployed requests are expected to include:

- `Content-Type: application/json`
- `api-key: <shared key>`
- `Authorization: Bearer <Firebase ID token>`

Start the development-project Functions emulator:

```bash
npm run serve-dev
```

The production-project emulator is available through `npm run serve-prod`. Both scripts build the TypeScript source and serve functions on port `9000`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run build` | Removes generated output and compiles TypeScript |
| `npm run serve-dev` | Builds and emulates functions against `distinc-dev` |
| `npm run serve-prod` | Builds and emulates functions against `distinc-9ad9d` |
| `npm run test` | Runs the Jest test suite |
| `npm run test-watch` | Runs Jest in watch mode |
| `npm run lint-ts` | Runs ESLint and TypeScript checks concurrently |
| `npm run lint-fix` | Applies supported ESLint fixes |
| `npm run prettify` | Formats TypeScript source with Prettier |
| `npm run deploy-dev` | Builds and deploys `dataService` to development |
| `npm run deploy-prod` | Builds and deploys `dataService` to production |

## Architecture

The service is organized by operation. Each feature contains an Express endpoint and a request-body type guard, while shared Firebase, middleware, validation, and error utilities live under `global/`.

```text
functions/src/
├── index.ts                 # Express composition and Cloud Function export
├── set*/                    # Create and update operations
├── get*/                    # User-scoped read operations
├── delete*/                 # Record and history deletion operations
└── global/
    ├── middleware/          # API-key and request-header checks
    ├── helpers/             # Validation, Firebase, date, and error helpers
    └── utils/               # Firestore collections and response codes
```

Requests pass through the shared middleware before reaching a route handler. The handler validates the payload, verifies the Firebase token, uses the decoded UID as the Firestore document key, and returns a consistent HTTP response.

## API Overview

All routes are mounted beneath the deployed `dataService` HTTPS function and are normally called through the API gateway.

| Domain | Write routes | Read route | Delete route |
|---|---|---|---|
| Savings accounts | `POST /setSavingsAccount` | `GET /getSavingsAccount` | `POST /deleteSavingsAccount` |
| Current accounts | `POST /setCurrentAccount` | `GET /getCurrentAccount` | `POST /deleteCurrentAccount` |
| Credit accounts | `POST /setCreditAccount` | `GET /getCreditAccount` | `POST /deleteCreditAccount` |
| Expenses | `POST /setExpense` | `GET /getExpenses` | `POST /deleteExpense` |
| Income | `POST /setIncome` | `GET /getIncomes` | `POST /deleteIncome` |
| Calculations | `POST /setCalculations` | `GET /getCalculations` | `POST /deleteCalculations` |

Firestore separates the main domains into collections such as `savingsAccounts`, `currentAccounts`, `creditAccounts`, `expenses`, `income`, and `calculations`. Each document is keyed by the authenticated user's UID.

## Testing and Quality

- TypeScript is configured with `strict: true`.
- ESLint checks type-aware rules, imports, unused code, formatting, and selected security concerns.
- Jest currently covers shared array, number, and object helper behavior.
- GitHub Actions runs type checking, linting, and tests before deployment.
- The build removes the generated `functions/lib` output before compiling to avoid stale artifacts.

Automated coverage currently focuses on utilities rather than HTTP handlers or Firestore integration.

## Deployment

The service deploys as the `dataService` Firebase HTTPS function. The GitHub Actions workflow uses Node.js 20.12.2 and Firebase CLI 13.7.2, then:

- deploys `dev` branch pushes to the `distinc-dev` Firebase project;
- deploys `prod` branch pushes to the `distinc-9ad9d` Firebase project;
- supplies the environment file and service-account credentials through repository secrets.

## Engineering Decisions

- User data is keyed by the UID decoded from Firebase Authentication, preventing route payloads from selecting another user's document.
- Request-body classes act as runtime type guards, keeping validation close to the domain model without adding a separate validation dependency.
- Firestore `set(..., { merge: true })`, field deletion, and array operations update targeted values without replacing unrelated user data.
- Shared middleware keeps gateway authentication and request-header checks consistent across all 18 routes.
- Separate development and production Firebase projects are tied to branch-specific deployments.

## Known Limitations and Roadmap

- Add endpoint and Firestore integration tests; current tests cover only shared helpers.
- Add a sanitized `.env.example` and documented Firebase emulator configuration.
- Add rate limiting and operational alerting.
