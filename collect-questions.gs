/**
 * Collects "Your Questions" submissions from Ramsey's class apps into a Google Sheet.
 *
 * SETUP (one time, ~3 minutes):
 * 1. Make a new Google Sheet. Name the first tab "Questions".
 *    Row 1 headers (optional but nice): Timestamp | App | Name | Class | Q1 | Q2 | Q3 | Q4 | Q5
 * 2. In that Sheet: Extensions -> Apps Script. Delete the sample, paste ALL of this file, Save.
 * 3. Deploy -> New deployment -> gear icon -> Web app.
 *      Description: collect questions
 *      Execute as: Me
 *      Who has access: Anyone
 *    Deploy -> Authorize access -> allow.
 * 4. Copy the Web app URL (ends in /exec).
 * 5. Paste that URL into QUESTIONS_ENDPOINT at the top of the app's index.html
 *    (or send it to Claude to wire in). One Sheet can collect from ALL your apps —
 *    the "App" column tells them apart.
 */
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Questions') || ss.getActiveSheet();
  var d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) { d = {}; }
  var q = d.questions || [];
  sheet.appendRow([
    new Date(),
    d.app || '',
    d.name || '',
    d.klass || '',
    q[0] || '', q[1] || '', q[2] || '', q[3] || '', q[4] || ''
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
