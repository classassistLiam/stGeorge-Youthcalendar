/**
 * ST. GEORGE YOUTH — calendar contribution records
 *
 * SETUP
 * 1. Create a Google Sheet and copy its spreadsheet ID.
 * 2. In Extensions > Apps Script, paste this file into Code.gs.
 * 3. Set SPREADSHEET_ID below to your Sheet ID.
 * 4. Run setup() once and approve permissions.
 * 5. Deploy > New deployment > Web app. Execute as: Me.
 *    Access: choose the option appropriate for your church's privacy policy.
 * 6. Copy the Web App URL into SCRIPT_URL in index.html.
 *
 * IMPORTANT:
 * This script displays records entered by an authorised treasurer/admin.
 * It does NOT automatically detect M-Pesa deposits. To automate verification,
 * integrate Safaricom Daraja STK/query or C2B confirmation callbacks and verify
 * callback signatures/tokens before calling recordVerifiedContribution().
 * Do not publish an endpoint that lets anonymous visitors submit arbitrary
 * contributor names or amounts.
 */
const SPREADSHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const CONTRIBUTIONS_SHEET = 'Contributions';
const EVENTS_SHEET = 'EventLog';
const EVENT_DATE = '2026-10-25';
const EVENT_TITLE = 'St. George Youth Sunday Contribution Gathering';

function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sh = ss.getSheetByName(CONTRIBUTIONS_SHEET);
  if (!sh) sh = ss.insertSheet(CONTRIBUTIONS_SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Timestamp', 'EventDate', 'EventTitle', 'ContributorName', 'AmountKES', 'ReceiptNumber', 'Message', 'Status']);
    sh.setFrozenRows(1);
  }
  let ev = ss.getSheetByName(EVENTS_SHEET);
  if (!ev) ev = ss.insertSheet(EVENTS_SHEET);
  if (ev.getLastRow() === 0) {
    ev.appendRow(['Timestamp', 'EventDate', 'EventTitle', 'EntryType', 'Summary', 'AmountKES', 'ReceiptNumber']);
    ev.setFrozenRows(1);
  }
  return 'Setup complete';
}

/** Public read-only endpoint consumed by index.html. */
function doGet(e) {
  const action = e && e.parameter && e.parameter.action ? e.parameter.action : 'contributions';
  if (action !== 'contributions') return json_({success:false, message:'Unknown action'});
  const eventDate = (e.parameter.eventDate || EVENT_DATE).trim();
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sh = ss.getSheetByName(CONTRIBUTIONS_SHEET);
    if (!sh || sh.getLastRow() < 2) return json_({success:true, contributions:[]});
    const rows = sh.getDataRange().getDisplayValues();
    const headers = rows.shift();
    const idx = Object.fromEntries(headers.map((h,i)=>[h,i]));
    const contributions = rows
      .filter(r => r[idx.Status] === 'VERIFIED' && r[idx.EventDate] === eventDate)
      .map(r => ({
        date: r[idx.Timestamp],
        name: r[idx.ContributorName],
        amount: Number(String(r[idx.AmountKES]).replace(/,/g,'')) || 0,
        message: r[idx.Message] || ''
      }))
      .reverse();
    return json_({success:true, eventDate:eventDate, contributions:contributions});
  } catch (err) {
    return json_({success:false, message:String(err)});
  }
}

/**
 * Admin-only helper: run from the Apps Script editor after a payment has been
 * checked against the official M-Pesa confirmation / statement.
 * Example: addVerifiedContribution('Jane Doe', 500, 'QAB12XYZ34', 'Thanksgiving');
 */
function addVerifiedContribution(name, amount, receiptNumber, message) {
  if (!name || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || !receiptNumber) {
    throw new Error('Provide contributor name, positive amount, and M-Pesa receipt number.');
  }
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(CONTRIBUTIONS_SHEET);
  if (!sh) throw new Error('Run setup() first.');
  const receipt = String(receiptNumber).trim().toUpperCase();
  const values = sh.getDataRange().getDisplayValues();
  const headers = values[0];
  const receiptCol = headers.indexOf('ReceiptNumber');
  if (values.slice(1).some(row => String(row[receiptCol]).trim().toUpperCase() === receipt)) {
    throw new Error('This receipt number is already recorded.');
  }
  const now = new Date();
  sh.appendRow([now, EVENT_DATE, EVENT_TITLE, String(name).trim(), Number(amount), receipt, message || '', 'VERIFIED']);
  logEvent_(now, EVENT_DATE, EVENT_TITLE, 'CONTRIBUTION', 'Verified contribution from ' + String(name).trim(), Number(amount), receipt);
  return 'Verified contribution recorded.';
}

function logEvent_(timestamp, eventDate, title, type, summary, amount, receipt) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sh = ss.getSheetByName(EVENTS_SHEET);
  if (!sh) { setup(); sh = ss.getSheetByName(EVENTS_SHEET); }
  sh.appendRow([timestamp, eventDate, title, type, summary, amount || '', receipt || '']);
}

/** Run this manually to record an event note against the calendar. */
function addCalendarEventLog(eventDate, title, summary) {
  if (!eventDate || !title || !summary) throw new Error('Date, title and summary are required.');
  logEvent_(new Date(), eventDate, title, 'EVENT_NOTE', summary, '', '');
  return 'Event note recorded.';
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
