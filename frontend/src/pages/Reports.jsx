import { useEffect, useState } from "react";
import ReportsTable from "../components/ReportsTable";
import ReportForm from "../components/ReportForm";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  // Fetch all reports
  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/reports"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const result = await response.json();
        setReports(result.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Could not load reports.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  // Mark report as resolved
  const markResolved = async (reportId) => {
    setUpdateError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/reports/${reportId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Resolved",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update report");
      }

      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === reportId ? result.data : report
        )
      );
    } catch (err) {
      console.error("Error updating report:", err);
      setUpdateError("Could not update the report. Please try again.");
    }
  };

  // Create a new report
  const handleCreateReport = async (newReport) => {
    setCreateError("");
    setCreateSuccess("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReport),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create report");
      }

      setReports((currentReports) => [
        ...currentReports,
        result.data,
      ]);

      setCreateSuccess(
        `Report ${result.data.id} created successfully.`
      );

      return true;
    } catch (err) {
      console.error("Error creating report:", err);
      setCreateError(err.message || "Could not create the report.");

      return false;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold text-emerald-700">
          DRAINSAFE / REPORTS
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Issue Reports
        </h1>

        <p className="mt-2 text-slate-500">
          Create, track and manage drainage issue reports.
        </p>
      </div>

      <ReportForm onCreateReport={handleCreateReport} />

      {createError && (
        <p className="mt-3 text-sm text-rose-700">
          {createError}
        </p>
      )}

      {createSuccess && (
        <p className="mt-3 text-sm text-emerald-700">
          {createSuccess}
        </p>
      )}

      {updateError && (
        <p className="mt-3 text-sm text-rose-700">
          {updateError}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-slate-500">
          Loading reports...
        </p>
      ) : error ? (
        <p className="mt-8 text-sm text-rose-700">
          {error}
        </p>
      ) : (
        <ReportsTable
          reports={reports}
          onMarkResolved={markResolved}
        />
      )}
    </div>
  );
}

export default Reports;