# Northstar Bank Account Origination API Partner Guide

The Account Origination API lets approved partners submit and track retail deposit account applications on behalf of customers who want to open Northstar Bank checking, savings, or premier accounts. Partners use this API to create an application, retrieve the latest status, respond to operational review outcomes, and cancel a submitted application when a customer withdraws interest. This demo API uses in-memory data and a simple API key so teams can validate partner workflows in Postman without connecting to production banking systems.

## Authentication

Send the API key in the `x-api-key` request header on every request.

```bash
curl http://localhost:3000/health \
  -H "x-api-key: demo-key" \
  -H "x-correlation-id: corr_demo_partner_001"
```

Invalid or missing keys return a standard error envelope:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid x-api-key header.",
    "correlationId": "corr_demo_partner_001"
  }
}
```

## Correlation IDs

Partners should send an `x-correlation-id` header for support traceability. If a request does not include one, Northstar generates a value with the `corr_demo_` prefix and returns it in the response.

## Example Integration Workflows

### Submit and Poll

1. Submit a new application with `POST /applications`.
2. Store the returned `data.id` as the Northstar application ID.
3. Poll `GET /applications/{application-id}` until the status changes from `submitted` to `in_review`, `approved`, `declined`, or `cancelled`.
4. Surface the latest status and decision reason to the partner onboarding experience.

### Operations Review

1. Submit the application through the partner onboarding flow.
2. Northstar operations moves the application to `in_review` using `PATCH /applications/{application-id}/status`.
3. The partner retrieves the updated application and displays the decision reason.
4. Northstar operations approves or declines the application after review.

### Customer Cancellation

1. Retrieve the application to confirm it is still `submitted` or `in_review`.
2. Call `DELETE /applications/{application-id}`.
3. Confirm the response returns `status: cancelled`.

## Rate Limits and Usage Guidelines

These mock limits represent the partner program expectations for demo conversations:

| Limit | Value |
|---|---:|
| Requests per partner API key | 600 requests per minute |
| Create application requests | 120 requests per minute |
| Status polling | No more than once every 30 seconds per application |
| Maximum page size | 100 applications |
| Support trace retention | 30 days |

Use a unique `partnerReferenceId` for every submitted application. Do not send full Social Security numbers; this API only accepts `ssnLast4`. Treat applicant data as confidential, log only correlation IDs and application IDs, and avoid placing sensitive applicant data in query strings.

## Status Values

| Status | Meaning |
|---|---|
| `submitted` | The application was accepted by the API and is awaiting review or automated decisioning. |
| `in_review` | Northstar operations is reviewing identity, funding, or eligibility signals. |
| `approved` | The application has been approved for account opening. |
| `declined` | The application cannot proceed. |
| `cancelled` | The application was cancelled before completion. |

## Partner Support

For onboarding, certification, and production-readiness questions, contact:

- Northstar Bank API Partner Team
- Email: api-partners@northstarbank.example
- Support hours: Monday-Friday, 8:00 AM-6:00 PM Mountain Time
- Escalation reference: include `x-correlation-id`, application ID, timestamp, and partner reference ID
