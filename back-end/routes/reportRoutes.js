// Pehli line Express import karti hai; doosri ek router object banati hai.
const express = require("express");
const router = express.Router();
const pool = require("../db");

// const reports = [
//   {
//     id: "DS-001",
//     assetId: "DR-001",
//     location: "Sample Ward 04",
//     issue: "Blocked drain",
//     status: "Open",
//   },
//   {
//     id: "DS-002",
//     assetId: "DR-014",
//     location: "Sample Ward 07",
//     issue: "Overflow",
//     status: "Under Review",
//   },
//   {
//     id: "DS-003",
//     assetId: "DR-021",
//     location: "Sample Ward 02",
//     issue: "Damaged cover",
//     status: "In Progress",
//   },
//   {
//     id: "DS-004",
//     assetId: "DR-008",
//     location: "Sample Ward 05",
//     issue: "Repeat blockage",
//     status: "Resolved",
//   },
// ];

// Get all drainage reports
// "/" hi kyun?
// Baad mein hum index.js mein router ko /api/reports path par mount karenge. Isliye router ke andar "/" ka matlab hoga GET /api/reports.
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, asset_id AS "assetId", location, issue, status FROM reports ORDER BY id',
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);

    res.status(500).json({
      success: false,
      message: "failed to fetch reports",
    });
  }
});

// Get all drainage reports
// index.js mein hum baad mein router ko /api/reports path par connect karenge. Isliye router ke andar "/" ka matlab hoga:
// Create a new drainage report
router.post("/", async (req, res) => {
  const { assetId, location, issue } = req.body;

  // Validate required fields
  if (
    typeof assetId !== "string" ||
    !assetId?.trim() ||
    typeof location !== "string" ||
    !location?.trim() ||
    typeof issue !== "string" ||
    !issue?.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Asset ID, location, and issue are required.",
    });
  }

  try {
    const idResult = await pool.query(
      "SELECT nextval('report_id_seq') AS next_number",
    );

    const nextNumber = Number(idResult.rows[0].next_number);

    const newReport = {
      id: `DS-${String(nextNumber).padStart(3, "0")}`,
      assetId: assetId.trim(),
      location: location.trim(),
      issue: issue.trim(),
      status: "Open",
    };

    const insertResult = await pool.query(
      `INSERT INTO reports (id, asset_id, location, issue, status)
   VALUES ($1, $2, $3, $4, $5)
   RETURNING id, asset_id AS "assetId", location, issue, status`,
      [
        newReport.id,
        newReport.assetId,
        newReport.location,
        newReport.issue,
        newReport.status,
      ],
    );

    res.status(201).json({
      success: true,
      data: insertResult.rows[0],
    });
  } catch (error) {
    console.error("Error creating report:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create report",
    });
  }
});

//api endpoint of reports
router.patch("/:id/status", async (req, res) => {
  const reportId = req.params.id;
  const { status } = req.body;

  if (status !== "Resolved") {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE reports
     SET status = $1
     WHERE id = $2
     RETURNING id, asset_id AS "assetId", location, issue, status`,
      [status, reportId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
      ś;
    }
    ś;

    return res.json({
      success: true,
      data: result.rows[0],
    });
    śś;
  } catch (error) {
    console.error("Error updating report:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update report",
    });
  }
});

//Build the Repeat-Failure API
// Get repeat-failure reports
router.get("/repeat-failures", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        asset_id AS "assetId",
        location,
        MIN(issue) AS issue,
        COUNT(*)::int AS "reportCount"
      FROM reports
      GROUP BY asset_id, location, LOWER(TRIM(issue))
      HAVING COUNT(*) >= 2
      ORDER BY COUNT(*) DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching repeat failures:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch repeat failures",
    });
  }
});

module.exports = router;

// file structure
// Express import
// Router creation
// Reports array
// router.get("/")
// router.post("/")
// router.patch("/:id/status")
// module.exports = router
