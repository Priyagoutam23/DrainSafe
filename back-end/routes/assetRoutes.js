// Ye API kya karegi?

// GET /api/assets call karne par PostgreSQL se saare registered assets fetch honge
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all registered assets
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT
                asset_id AS "assetId",
                location,
                asset_type AS "assetType",
                asset_condition AS "assetCondition",
                created_at AS "createdAt"
            FROM assets
            ORDER BY asset_id
        `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching assets:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch assets",
    });
  }
});  

// Update asset condition
router.patch("/:assetId/condition", async (req, res) => {
  const { assetId } = req.params;
  const { condition } = req.body;

  const allowedConditions = [
    "Good",
    "Needs Maintenance",
    "Critical",
    "Unknown",
  ];

  if (!allowedConditions.includes(condition)) {
    return res.status(400).json({
      success: false,
      message: "Invalid asset condition",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE assets
       SET asset_condition = $1
       WHERE asset_id = $2
       RETURNING asset_id AS "assetId",
       location,
       asset_type AS "assetType",
       asset_condition AS "assetCondition"`,
      [condition, assetId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating asset condition:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update asset condition",
    });
  }
});

module.exports = router;
