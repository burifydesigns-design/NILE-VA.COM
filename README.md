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

The browser uses a `no-cors` request because Google Apps Script web apps may not return CORS headers. This means the browser cannot verify that a row was written to Google Sheets: a resolved request only confirms that the browser did not report a network error. Confirm the Apps Script deployment, its access permissions, and the destination spreadsheet separately before relying on the integration in production.

The Apps Script endpoint is configured in `js/main.js`. Keep spreadsheet IDs, access tokens, and any other credentials on the server/Apps Script side; do not add them to this repository or frontend code.

A honeypot field and client-side rate limiting (5-second cooldown) are implemented to reduce spam submissions.

## Deployment

Deploy the repository root as a static site. `vercel.json` provides security headers and caching configuration for Vercel. Confirm that `https://nile-va.com/` remains the production domain before deployment, as it is used in canonical, Open Graph, sitemap, and structured-data URLs.

## Required business configuration

- Verify the Calendly event URL in `js/main.js`.
- Verify the Google Apps Script URL and its JSON field mapping (`name`, `email`, `timestamp`, `source`).
- Social profile URLs are configured in the footer and Open Graph metadata.
- Environment variables are documented in `.env.example` — copy to `.env` for local configuration.