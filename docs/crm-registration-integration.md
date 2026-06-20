# Antioch Bible Study CRM Registration Integration

The website can forward registration submissions to the DaBible CRM API after the local form validates.

## Website environment

```env
DABIBLE_CRM_REGISTRATION_ENDPOINT=https://api.dabible.com/api/v3/antioch/bible-study-registrations
DABIBLE_CRM_API_TOKEN=server-to-server-token-from-crm
DABIBLE_CRM_TIMEOUT_MS=8000
```

If `DABIBLE_CRM_REGISTRATION_ENDPOINT` is not configured, CRM sync is skipped and the existing registration flow continues.

## Request

The website sends:

```http
POST /api/v3/antioch/bible-study-registrations
Authorization: Bearer <DABIBLE_CRM_API_TOKEN>
Content-Type: application/json
Accept: application/json
```

Payload shape:

```json
{
  "source": {
    "app": "welcome-to-antioch",
    "domain": "welcometoantioch.com",
    "form": "antioch-bible-study-registration",
    "submittedAt": "2026-06-20T00:00:00.000Z"
  },
  "idempotencyKey": "sha256-key",
  "participant": {
    "firstName": "Jane",
    "lastName": "Doe",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+15551234567",
    "country": "United States of America",
    "countryCode": "US",
    "dialCode": "+1",
    "address": {
      "line1": "123 Main St",
      "city": "Dallas",
      "state": "TX",
      "postalCode": "75001",
      "formatted": "123 Main St, Dallas, TX 75001"
    }
  },
  "registration": {
    "program": "Antioch Bible Study",
    "session": "2026 Summer Bible Study",
    "theme": "Fear of God",
    "ageGroup": "Teens (ages 12-15)",
    "ageGroupSlug": "teens",
    "isTeen": true,
    "knowsAntiochOrDaBibleFoundation": false,
    "preferredContactMethod": "SMS",
    "otherContactDetail": ""
  },
  "guardian": {
    "firstName": "John",
    "lastName": "Doe",
    "name": "John Doe",
    "phone": "+15557654321",
    "email": "john@example.com"
  },
  "consent": {
    "accepted": true,
    "signatureDataUrl": "data:image/png;base64,..."
  },
  "payment": {
    "required": true,
    "status": "checkout_created",
    "amountCents": 5000,
    "currency": "usd",
    "provider": "stripe",
    "checkoutSessionId": "cs_live_...",
    "checkoutUrl": "https://checkout.stripe.com/..."
  }
}
```

## CRM behavior to implement

- Validate `Authorization: Bearer <token>` against a CRM environment variable.
- Enforce idempotency using `idempotencyKey` so duplicate form submissions or retries update the same CRM record.
- Create or update the CRM user by normalized email first, then phone.
- Store `phone` in `phone_number`/`phone_e164`, `countryCode` in `phone_country_code`, `country` in `phone_country_name`, and `dialCode` in `phone_calling_code` where appropriate.
- Store Bible Study registration details in a dedicated table or in user metadata/settings until a dedicated model exists.
- For teen registrations, store guardian and consent/signature data with restricted admin access.
- For `payment.status = "checkout_created"`, mark the registration as pending payment until the CRM Stripe webhook confirms payment.
