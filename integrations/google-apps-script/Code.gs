/**
 * ============================================================================
 * CODENAME MAJHA GHAR (LJ TANNA PANORAMA) — GOOGLE APPS SCRIPT LEAD WEBHOOK
 * Target Spreadsheet: https://docs.google.com/spreadsheets/d/1LCGztDOS6utQ3ngKfnYicR3vJfao1pyUyVmrkjGuK3c/edit
 * ============================================================================
 *
 * HOW TO DEPLOY IN 60 SECONDS:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1LCGztDOS6utQ3ngKfnYicR3vJfao1pyUyVmrkjGuK3c/edit
 * 2. In the top menu, click: Extensions > Apps Script
 * 3. Delete any default code in the editor, and paste this entire file contents.
 * 4. Click the blue "Deploy" button (top-right) > Select "New deployment".
 * 5. Click the gear icon (⚙️) next to "Select type" and choose "Web app".
 * 6. Set the following fields:
 *    - Description: "Majha Ghar Website Lead Sync"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone"  <-- CRITICAL: Must be "Anyone" so website visitors can submit
 * 7. Click "Deploy". Authorize permissions when prompted by Google.
 * 8. Copy the generated "Web app URL" (it starts with https://script.google.com/macros/s/...)
 * 9. Paste that URL into assets/js/main.js in PROJECT_CONFIG.googleSheetWebhookUrl!
 * ============================================================================
 */

// Target Spreadsheet ID
var SPREADSHEET_ID = "1LCGztDOS6utQ3ngKfnYicR3vJfao1pyUyVmrkjGuK3c";
var SHEET_NAME = "Leads";

/**
 * Handles incoming POST requests from the website lead form.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for concurrent requests
  lock.tryLock(10000);

  try {
    var sheet = getOrCreateSheet();
    var data = {};

    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Format IST Timestamp
    var now = new Date();
    var istTimestamp = Utilities.formatDate(now, "Asia/Kolkata", "dd-MMM-yyyy hh:mm:ss a") + " IST";

    var name = (data.name || data.fullName || "Website Visitor").toString().trim();
    var phone = (data.phone || data.phoneNumber || "").toString().trim();
    var config = (data.configuration || "1 BHK / 2.5 BHK").toString().trim();
    var visitDate = (data.visitDate || "Immediate Visit").toString().trim();
    var source = (data.source || data.formType || "Website Lead").toString().trim();
    var project = (data.project || "Codename Majha Ghar").toString().trim();

    // Sanitize phone for Google Sheets display (prefix with ' to prevent numeric scientific notation)
    var formattedPhone = phone ? "'" + phone : "";

    // Append new lead row
    sheet.appendRow([
      istTimestamp,
      name,
      formattedPhone,
      config,
      visitDate,
      source,
      project
    ]);

    // Format the newly added row
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 7).setVerticalAlignment("middle");
    sheet.getRange(lastRow, 3).setHorizontalAlignment("center"); // Center phone numbers

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Lead recorded successfully",
        row: lastRow,
        leadName: name
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Handles GET requests (used to test if the web app is live & reachable).
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "online",
      project: "Codename Majha Ghar Lead Webhook",
      spreadsheetId: SPREADSHEET_ID,
      activeSheet: SHEET_NAME,
      instructions: "Send POST requests with { name, phone, configuration, visitDate, source } JSON payload."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Retrieves the target sheet or creates it with formatted luxury headers.
 */
function getOrCreateSheet() {
  var ss;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (err) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }

  if (!ss) {
    throw new Error("Could not access spreadsheet with ID: " + SPREADSHEET_ID);
  }

  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    // If 'Leads' tab doesn't exist, check if first sheet is empty or create 'Leads'
    var firstSheet = ss.getSheets()[0];
    if (firstSheet.getLastRow() === 0) {
      firstSheet.setName(SHEET_NAME);
      sheet = firstSheet;
    } else {
      sheet = ss.insertSheet(SHEET_NAME);
    }
  }

  // Setup headers if sheet is brand new
  if (sheet.getLastRow() === 0) {
    var headers = [
      "Timestamp (IST)",
      "Full Name",
      "Mobile Number",
      "Configuration",
      "Preferred Visit Date",
      "Lead Source",
      "Project"
    ];

    sheet.appendRow(headers);

    // Apply Luxury Real Estate Styling to Header
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0A143A"); // Brand Royal Navy
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Arial");
    headerRange.setFontSize(10);
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 35);
    sheet.setFrozenRows(1);

    // Set column widths
    sheet.setColumnWidth(1, 200); // Timestamp
    sheet.setColumnWidth(2, 180); // Name
    sheet.setColumnWidth(3, 150); // Mobile
    sheet.setColumnWidth(4, 180); // Configuration
    sheet.setColumnWidth(5, 170); // Visit Date
    sheet.setColumnWidth(6, 200); // Source
    sheet.setColumnWidth(7, 180); // Project
  }

  return sheet;
}
