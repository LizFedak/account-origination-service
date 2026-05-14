# Account Origination API - Northstar Bank

![Northstar Bank Account Origination API](https://img.shields.io/badge/Northstar%20Bank-Account%20Origination%20API-0A4D68)

Northstar Bank’s Account Origination API enables trusted digital channels and approved fintech partners to submit, track, and manage new retail account applications for checking and savings products. The primary consumers are Northstar’s web and mobile teams, branch-assist tools, and external onboarding partners using a Postman Partner Workspace. The API centralizes application intake, decision status, applicant information, and disclosure consent so the bank can provide a consistent, governed origination experience across channels. It belongs in the API portfolio as the reusable onboarding entry point for retail deposit growth and partner-led acquisition.

## Quick Start

```bash
npm install
npm start
# Server running at http://localhost:3001
```

The service reads `PORT` and `API_KEY` from the environment. Defaults are `PORT=3001` and `API_KEY=demo-key`.

## curl Examples

```bash
# Happy path
curl http://localhost:3001/health -H "x-api-key: demo-key"

# Unauthorized
curl http://localhost:3001/health -H "x-api-key: wrong-key"
```

Create an application:

```bash
curl -X POST http://localhost:3001/applications \
  -H "x-api-key: demo-key" \
  -H "Content-Type: application/json" \
  -d '{
    "productCode": "NORTHSTAR_CHECKING",
    "channel": "partner",
    "applicant": {
      "firstName": "Taylor",
      "lastName": "Reed",
      "email": "taylor.reed@example.com",
      "phone": "+1-555-0144",
      "dateOfBirth": "1992-07-21",
      "ssnLast4": "4422",
      "address": {
        "line1": "200 Park Avenue",
        "city": "New York",
        "state": "NY",
        "postalCode": "10017",
        "country": "US"
      }
    },
    "employment": {
      "employmentStatus": "employed",
      "annualIncome": 104000
    },
    "funding": {
      "initialDepositAmount": 500,
      "fundingSource": "external_ach"
    },
    "consents": {
      "privacyPolicyAccepted": true,
      "eSignAccepted": true
    },
    "requestedDebitCard": true,
    "partnerReferenceId": "partner-demo-2026-0001"
  }'
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Protected service health check for smoke tests and monitors. |
| GET | `/applications` | List applications with optional `status`, `productCode`, `channel`, and `limit` filters. |
| POST | `/applications` | Create a new retail deposit account application. |
| GET | `/applications/{application-id}` | Retrieve one application by ID. |
| PATCH | `/applications/{application-id}/status` | Update application lifecycle status. |
| DELETE | `/applications/{application-id}` | Cancel a submitted or in-review application. |

## Postman Setup

1. Import `openapi.yaml` as the API definition in Postman.
2. Import `postman/collection.json`.
3. Import `postman/environment.json` and select `Northstar Bank — Account Origination API`.
4. Confirm `baseUrl` is `http://localhost:1` and `apiKey` is `demo-key`.
5. Run the collection folders in this order for the cleanest demo: Smoke Tests, E2E Workflow, CRUD Operations, Negative Tests.

The collection uses collection variables such as `applicationId`, `e2eApplicationId`, and `crudApplicationId`. Requests capture generated IDs with `pm.collectionVariables.set()` and reuse them in follow-up calls.

## Docker

```bash
docker build -t northstar/account-origination-api:1.0.0 .
docker run --rm -p 3001:3001 -e API_KEY=demo-key northstar/account-origination-api:1.0.0
```

## Helm

Render the chart:

```bash
helm template account-origination-api ./helm/account-origination-api
```

Install or upgrade:

```bash
helm install account-origination-api ./helm/account-origination-api
helm upgrade account-origination-api ./helm/account-origination-api
```

The default chart deploys two replicas, a ClusterIP service on port 80, an ingress host at `account-origination-api.northstarbank.internal`, and an `API_KEY` secret initialized to `demo-key`.

## Postman Enterprise Demo Guide

Use this project to show how Northstar Bank manages partner-facing APIs through Postman Enterprise:

1. Import `openapi.yaml` as the source API definition.
2. Link `postman/collection.json` to the API as runnable validation and onboarding examples.
3. Publish the API to the Postman Private API Network so internal teams can discover the governed API contract.
4. Create a Postman Monitor for the Smoke Tests folder to run scheduled health, auth, and list checks.
5. Share the collection and `PARTNER_API_GUIDE.md` in a Postman Partner Workspace for fintech onboarding.

Partner Workspace talking points:

- Partners get a curated collection, environment, and guide without needing internal-only implementation details.
- Collection tests demonstrate the happy path, lifecycle transitions, and expected error handling.
- Correlation IDs make partner support conversations concrete and traceable.
- The OpenAPI definition provides a contract that can be reviewed, versioned, and linked to implementation artifacts.

## Troubleshooting

| Issue | Fix |
|---|---|
| `401 UNAUTHORIZED` | Confirm the request includes `x-api-key: demo-key` or set `API_KEY` to match your desired value. |
| `Cannot find module 'express'` | Run `npm install` from the project root. |
| Port already in use | Start with another port: `PORT=3001 npm start`, then update the Postman `baseUrl`. |
| Postman variables are empty | Run the create request before read, update, or delete workflow requests. |
| Helm probe failures | Ensure the deployed `apiKeySecret.value` matches the application `API_KEY`; probes call `/health` with the configured key. |
| Invalid status transition | Use the supported flow: `submitted` to `in_review`, then `approved`, `declined`, or `cancelled`. |

## Project Structure

```text
account-origination-api/
├── openapi.yaml
├── package.json
├── src/
├── postman/
├── Dockerfile
├── .dockerignore
├── helm/
├── PARTNER_API_GUIDE.md
└── README.md
```
