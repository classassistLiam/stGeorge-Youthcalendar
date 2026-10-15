ST. GEORGE YOUTH CALENDAR — GREEN & WHITE UPGRADE

FILES
- st_george_youth_calendar_upgraded.html : single-file frontend
- Code.gs : Google Apps Script backend for read-only verified contribution records

WHAT CHANGED
- Green and white church-friendly palette with subtle gold accents.
- Responsive November and December 2026 calendar grids with event-day highlights.
- Bright M-PESA-style contribution poster displaying Till 8151142 and copy buttons.
- Existing interactive spiritual avatar and daily scripture prompts retained.
- Contribution records can be filtered by the selected calendar event date.
- Existing Google Sheets read-only endpoint retained; the backend helper can record a contribution against an optional 2026 event date/title.

CONNECT GOOGLE SHEETS
1. Create/open the Google Sheet that should hold church records.
2. In Google Sheets choose Extensions > Apps Script.
3. Replace the editor's Code.gs with the supplied Code.gs.
4. Replace PASTE_GOOGLE_SHEET_ID_HERE with the ID from your spreadsheet URL.
5. Save, select setup, and Run it once. Approve permissions.
6. Deploy > New deployment > Web app. Set Execute as: Me. Choose access appropriate for the church's privacy policy.
7. Copy the deployed Web app URL ending in /exec.
8. Open st_george_youth_calendar_upgraded.html in a text editor and set:
   const SCRIPT_URL = "PASTE_YOUR_DEPLOYED_WEB_APP_URL_HERE";
9. Save and reload the HTML page online or locally.

IMPORTANT CONTRIBUTION SAFETY
- The public endpoint only reads records marked VERIFIED.
- Do not expose a public form that allows anyone to submit a name or amount as verified.
- To record a contribution, the treasurer should verify the M-PESA receipt first, then run the helper in Apps Script, for example:
  addVerifiedContribution('Jane Doe', 500, 'QAB12XYZ34', 'Youth Sunday', '2026-12-06', 'KAYO Sunday Climax');
- The optional date must be in 2026 October, November or December. If omitted, the default remains 25 October 2026.
- This is not an automatic M-PESA integration. It does not independently detect deposits. Daraja callbacks require a separately secured integration.
- The page is a frontend, not a secure login system; don't use its demo sign-in to protect private member data.
stgeorge-Youthcalendar
