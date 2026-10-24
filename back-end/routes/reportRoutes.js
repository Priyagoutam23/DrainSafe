// Pehli line Express import karti hai; doosri ek router object banati hai.
const express = require("express");
const router = express.Router();
const reports = [
  {
    id: "DS-001",
    assetId: "DR-001",
    location: "Sample Ward 04",
    issue: "Blocked drain",
    status: "Open",
  },
  {
    id: "DS-002",
    assetId: "DR-014",
    location: "Sample Ward 07",
    issue: "Overflow",
    status: "Under Review",
  },
  {
    id: "DS-003",
    assetId: "DR-021",
    location: "Sample Ward 02",
    issue: "Damaged cover",
    status: "In Progress",
  },
  {
    id: "DS-004",
    assetId: "DR-008",
    location: "Sample Ward 05",
    issue: "Repeat blockage",
    status: "Resolved",
  },
];

// Get all drainage reports
// "/" hi kyun?
// Baad mein hum index.js mein router ko /api/reports path par mount karenge. Isliye router ke andar "/" ka matlab hoga GET /api/reports.
router.get("/", (req, res) => {
  res.json({
    success: true,
    count: reports.length,
    data: reports,
  });
});

// Get all drainage reports
// index.js mein hum baad mein router ko /api/reports path par connect karenge. Isliye router ke andar "/" ka matlab hoga:
// Create a new drainage report
router.post("/", (req, res) => {
  const { assetId, location, issue } = req.body;

  // Validate required fields
  if (
    !assetId?.trim() ||
    !location?.trim() ||
    !issue?.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Asset ID, location, and issue are required.",
    });
  }

  const nextNumber =
    reports.reduce((max, report) => {
      const number = Number(report.id.replace("DS-", ""));
      return Math.max(max, number);
    }, 0) + 1;

  const newReport = {
    id: `DS-${String(nextNumber).padStart(3, "0")}`,
    assetId: assetId.trim(),
    location: location.trim(),
    issue: issue.trim(),
    status: "Open",
  };

  reports.push(newReport);

  res.status(201).json({
    success: true,
    data: newReport,
  });
}); 




//api endpoint of reports
router.patch("/:id/status", (req, res) => {
  const reportId = req.params.id;
  const { status } = req.body;

  if (status !== "Resolved") {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }

  const report = reports.find((item) => item.id === reportId);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: "Report not found",
    });
  }

  report.status = status;

  res.json({
    success: true,
    data: report,
  });
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














