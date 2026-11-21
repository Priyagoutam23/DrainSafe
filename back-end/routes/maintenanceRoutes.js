const express = require("express");
const router = express.Router();
const pool = require("../db");

const allowedActivityTypes = ["Cleaning", "Repair", "Inspection"];

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
    typeof assetId !== "string" ||
    !assetId.trim() ||
    typeof description !== "string" ||
    !description.trim()
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
      [assetId.trim(), activityType, description.trim(), activityDate || null],
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

//new API
// GET issues reported again after the latest cleaning
router.get("/recurrence", async (req, res) => {
  try {
    const result = await pool.query(`
      WITH latest_cleaning AS (
        SELECT DISTINCT ON (asset_id)
          asset_id,
          activity_date AS last_cleaning_date
        FROM maintenance_activities
        WHERE activity_type = 'Cleaning'
        ORDER BY asset_id, activity_date DESC, activity_id DESC
      ),

      issue_recurrence AS (
        SELECT
          r.asset_id AS "assetId",
          a.location,
          MIN(r.issue) AS issue,
          lc.last_cleaning_date AS "lastCleaningDate",

          COUNT(*) FILTER (
            WHERE (r.created_at AT TIME ZONE 'Asia/Kolkata')::date
                  < lc.last_cleaning_date
          )::int AS "reportsBeforeCleaning",

          COUNT(*) FILTER (
            WHERE (r.created_at AT TIME ZONE 'Asia/Kolkata')::date
                  > lc.last_cleaning_date
          )::int AS "reportsAfterCleaning",

          MAX(r.created_at) FILTER (
            WHERE (r.created_at AT TIME ZONE 'Asia/Kolkata')::date
                  > lc.last_cleaning_date
          ) AS "lastReportedAfterCleaning"

        FROM reports r

        INNER JOIN latest_cleaning lc
          ON r.asset_id = lc.asset_id

        INNER JOIN assets a
          ON r.asset_id = a.asset_id

        GROUP BY
          r.asset_id,
          a.location,
          LOWER(TRIM(r.issue)),
          lc.last_cleaning_date
      )

      SELECT
        "assetId",
        location,
        issue,
        "lastCleaningDate",
        "reportsBeforeCleaning",
        "reportsAfterCleaning",
        "lastReportedAfterCleaning",
            (
      ("lastReportedAfterCleaning" AT TIME ZONE 'Asia/Kolkata')::date
      - "lastCleaningDate"
    ) AS "daysToRecurrence",
        'Repeated after cleaning' AS "recurrenceStatus"

      FROM issue_recurrence

      WHERE "reportsBeforeCleaning" > 0
        AND "reportsAfterCleaning" > 0

      ORDER BY "lastReportedAfterCleaning" DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error detecting maintenance recurrence:", error);

    res.status(500).json({
      success: false,
      message: "Failed to detect maintenance recurrence",
    });
  }
});

module.exports = router;
