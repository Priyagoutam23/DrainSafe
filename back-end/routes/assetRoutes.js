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
// Update asset condition and record history
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

  let client;

  try {
    client = await pool.connect();

    await client.query("BEGIN");

    // Get current condition
    const currentResult = await client.query(
      `SELECT asset_condition
       FROM assets
       WHERE asset_id = $1
       FOR UPDATE`,
      [assetId],
    );

    if (currentResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    const previousCondition = currentResult.rows[0].asset_condition;

    // Avoid duplicate history for unchanged condition
    if (previousCondition === condition) {
      await client.query("COMMIT");

      return res.json({
        success: true,
        message: "Asset condition is already up to date",
      });
    }

    // Update current asset condition
    const result = await client.query(
      `UPDATE assets
       SET asset_condition = $1
       WHERE asset_id = $2
       RETURNING asset_id AS "assetId",
       location,
       asset_type AS "assetType",
       asset_condition AS "assetCondition"`,
      [condition, assetId],
    );

    // Save condition change in history
    await client.query(
      `INSERT INTO asset_condition_history
       (asset_id, previous_condition, new_condition)
       VALUES ($1, $2, $3)`,
      [assetId, previousCondition, condition],
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch(console.error);
    }

    console.error("Error updating asset condition:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update asset condition",
    });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// Get all asset condition history
router.get("/history", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        h.history_id AS "historyId",
        h.asset_id AS "assetId",
        a.location,
        h.previous_condition AS "previousCondition",
        h.new_condition AS "newCondition",
        h.changed_at AS "changedAt"
      FROM asset_condition_history h
      INNER JOIN assets a
        ON h.asset_id = a.asset_id
      ORDER BY h.changed_at DESC, h.history_id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching maintenance history:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance history",
    });
  }
});
module.exports = router;
