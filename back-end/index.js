const express = require("express");
const cors = require("cors");


// app humara Express application hai. Isse hum routes define karenge aur server start karenge.
const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// Allow the server to read JSON request bodies
app.use(express.json());

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

// Health-check API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DrainSafe backend is running",
  });
});

// Get all drainage reports
app.get("/api/reports", (req, res) => {
  res.json({
    success: true,
    count: reports.length,
    data: reports,
  });
});

// Create a new drainage report
app.post("/api/reports", (req, res) => {
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
app.patch("/api/reports/:id/status", (req, res) => {
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

// Start the server
app.listen(PORT, () => {
  console.log(`DrainSafe backend running at http://localhost:${PORT}`);
});
