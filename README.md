# NILE VA Services

Static marketing website for NILE VA Services, providing virtual assistant support for UGC creators and influencers.

## Run locally

No dependency installation or build step is required. Serve the project root with a local static server, for example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Booking and lead capture

The form validates the required name and email fields, opens the NILE VA Calendly booking page with those fields prefilled, and sends a JSON payload to the configured Google Apps Script endpoint.

The browser uses a `no-cors` request because Google Apps Script web apps may not return CORS headers. The browser cannot read the response or verify that a row was written to Google Sheets. The success message therefore says the inquiry was attempted, not confirmed. Confirm the Apps Script deployment, access permissions, server-side validation, spam controls, and destination spreadsheet separately before relying on the integration in production.

The Apps Script endpoint is configured in `js/main.js`. Keep spreadsheet IDs, access tokens, and any other credentials on the server/Apps Script side; do not add them to this repository or frontend code.

A CSS-hidden honeypot field and client-side rate limiting (5-second cooldown) are implemented as lightweight friction only. Client-side controls are not security boundaries; add server-side validation and rate limiting in Apps Script before treating the endpoint as production-hardened.

The booking link is `https://calendly.com/catevirtualassistant/30min`. The site opens it in a new tab and also provides a direct fallback link.

## Deployment

Deploy the repository root as a static site. `vercel.json` provides security headers and caching configuration for Vercel. Confirm that `https://nile-va.com/` remains the production domain before deployment, as it is used in canonical, Open Graph, sitemap, and structured-data URLs.

## Required business configuration

- Verify the Calendly event URL in `js/main.js`.
- Verify the Google Apps Script URL and its JSON field mapping (`name`, `email`, `timestamp`, `source`).
- Social profile URLs are configured in the footer and Open Graph metadata.
- `.env.example` is reference documentation only. This static site does not load `.env` files or receive Vercel environment variables in browser JavaScript. Do not place secrets in frontend code.
