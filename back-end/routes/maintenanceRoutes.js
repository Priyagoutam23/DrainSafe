
const express = require("express");
const router = express.Router();
const pool = require("../db");

const allowedActivityTypes = [
  "Cleaning",
  "Repair",
  "Inspection",
];

// GET all maintenance activities
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        m.activity_id AS "activityId",
        m.asset_id AS "assetId",
        a.location,
        m.activity_type AS "activityType",
        m.description,
        m.activity_date AS "activityDate",
        m.created_at AS "createdAt"
      FROM maintenance_activities m
      INNER JOIN assets a
        ON m.asset_id = a.asset_id
      ORDER BY m.activity_date DESC, m.activity_id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    console.error("Error fetching maintenance activities:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance activities",
    });
  }
});

// POST create maintenance activity
router.post("/", async (req, res) => {
  const { assetId, activityType, description, activityDate } = req.body;

  if (
    typeof assetId !== "string" || !assetId.trim() ||
    typeof description !== "string" || !description.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Asset ID and description are required.",
    });
  }

  if (!allowedActivityTypes.includes(activityType)) {
    return res.status(400).json({
      success: false,
      message: "Invalid activity type.",
    });
  }

  if (
    activityDate !== undefined &&
    activityDate !== null &&
    (typeof activityDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(activityDate))
  ) {
    return res.status(400).json({
      success: false,
      message: "Activity date must be in YYYY-MM-DD format.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO maintenance_activities
       (asset_id, activity_type, description, activity_date)
       VALUES ($1, $2, $3, COALESCE($4::date, CURRENT_DATE))
       RETURNING
         activity_id AS "activityId",
         asset_id AS "assetId",
         activity_type AS "activityType",
         description,
         activity_date AS "activityDate",
         created_at AS "createdAt"`,
      [
        assetId.trim(),
        activityType,
        description.trim(),
        activityDate || null,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Error creating maintenance activity:", error);

    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Asset not found.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create maintenance activity",
    });
  }
});

module.exports = router;
