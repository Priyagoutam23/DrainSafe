import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import RepeatFailureTable from "../components/RepeatFailureTable";

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [assets, setAssets] = useState([]);
  const [repeatFailures, setRepeatFailures] = useState([]);

  const [loading, setLoading] = useState(true);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [repeatLoading, setRepeatLoading] = useState(true);

  const [error, setError] = useState("");
  const [assetsError, setAssetsError] = useState("");
  const [repeatError, setRepeatError] = useState("");

  // Fetch reports
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
        console.error(err);
        setError("Could not load reports.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  // Fetch assets
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/assets"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assets");
        }

        const result = await response.json();
        setAssets(result.data);
      } catch (err) {
        console.error(err);
        setAssetsError("Could not load assets.");
      } finally {
        setAssetsLoading(false);
      }
    };

    loadAssets();
  }, []);

  // Fetch repeat failures
  useEffect(() => {
    const loadRepeatFailures = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/reports/repeat-failures"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch repeat failures");
        }

        const result = await response.json();
        setRepeatFailures(result.data);
      } catch (err) {
        console.error(err);
        setRepeatError("Could not load repeat-failure alerts.");
      } finally {
        setRepeatLoading(false);
      }
    };

    loadRepeatFailures();
  }, []);

  const openReportsCount = reports.filter(
    (report) => report.status !== "Resolved"
  ).length;

  const resolvedReportsCount = reports.filter(
    (report) => report.status === "Resolved"
  ).length;

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold text-emerald-700">
          DRAINSAFE / DASHBOARD
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Good morning!
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor drainage assets, reported issues and maintenance activity.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Registered assets"
          value={assetsLoading ? "..." : assets.length}
          description="Assets registered in database"
        />

        <StatCard
          title="Open reports"
          value={loading ? "..." : openReportsCount}
          description="Awaiting review or action"
          tone="amber"
        />

        <StatCard
          title="Repeat-failure alerts"
          value={repeatLoading ? "..." : repeatFailures.length}
          description="Recurring drainage problems"
          tone="rose"
        />

        <StatCard
          title="Resolved Reports"
          value={loading ? "..." : resolvedReportsCount}
          description="Successfully closed issues"
        />
      </div>

      {assetsError && (
        <p className="mt-3 text-sm text-rose-700">{assetsError}</p>
      )}

      {error && (
        <p className="mt-3 text-sm text-rose-700">{error}</p>
      )}

      {repeatError ? (
        <p className="mt-6 text-sm text-rose-700">{repeatError}</p>
      ) : repeatLoading ? (
        <p className="mt-6 text-sm text-slate-500">
          Loading repeat-failure alerts...
        </p>
      ) : (
        <RepeatFailureTable repeatFailures={repeatFailures} />
      )}
    </div>
  );
}

export default Dashboard;

// Is page mein kya shift hua?
// - Summary cards
// - Registered assets count
// - Open and resolved reports count
// - Repeat-failure alerts