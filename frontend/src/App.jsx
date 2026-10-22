import { useEffect, useState } from "react";
import StatCard from "./components/StatCard";
import ReportsTable from "./components/ReportsTable";
import ReportForm from "./components/ReportForm";
function App() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  //data fetching from backend
  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reports");

        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const result = await response.json();
        setReports(result.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Could not load reports. Check the backend server.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);
  //{ ...report, status: "Resolved" } ka matlab hai purane report object ki baaki properties preserve karna aur sirf status ko change karna.
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
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update report");
      }

      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === reportId ? result.data : report,
        ),
      );
    } catch (err) {
      console.error("Error updating report:", err);
      setUpdateError(
        "Could not update the report. Check the backend and try again.",
      );
    }
  };

  const openReportsCount = reports.filter(
    (report) => report.status != "Resolved",
  ).length;

  const resolvedReportsCount = reports.filter(
    (report) => report.status === "Resolved",
  ).length;

  const handleCreateReport = async (newReport) => {
    setCreateError("");
    setCreateSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReport),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create report");
      }

      setReports((currentReports) => [...currentReports, result.data]);

      setCreateSuccess(`Report ${result.data.id} created successfully.`);

      return true;
    } catch (err) {
      console.error("Error creating report:", err);
      setCreateError(err.message || "Could not create the report.");

      return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-slate-950 p-6 text-white md:flex">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-bold">
            D
          </div>
          <div>
            <h1 className="text-xl font-bold">DrainSafe</h1>
            <p className="text-xs text-slate-400">
              Infrastructure intelligence
            </p>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Workspace
        </p>

        <nav className="space-y-2">
          <a
            href="#overview"
            className="block rounded-lg bg-emerald-700 px-4 py-3 font-medium"
          >
            Overview
          </a>
          <a
            href="#assets"
            className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
          >
            Drainage Assets
          </a>
          <a
            href="#reports"
            className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
          >
            Issue Reports
          </a>
          <a
            href="#maintenance"
            className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
          >
            Maintenance History
          </a>
        </nav>

        <div className="mt-auto rounded-xl border border-slate-700 p-4">
          <p className="font-medium">DrainSafe MVP</p>
          <p className="mt-1 text-xs text-slate-400">
            Learning and development build
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-sm text-slate-500">Workspace / Overview</p>
            <h2 className="mt-1 text-lg font-semibold">Drainage Operations</h2>
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
            Demo data
          </span>
        </header>

        {/* Dashboard */}
        <main id="overview" className="mx-auto max-w-7xl p-5 sm:p-8">
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
              value="128"
              description="Sample drainage records"
            />

            <StatCard
              title="Open reports"
              value={openReportsCount}
              description="Awaiting review or action"
              tone="amber"
            />

            <StatCard
              title="Repeat-failure alerts"
              value="7"
              description="Potential recurring problems"
              tone="rose"
            />

            <StatCard
              title="Resolved Reports"
              value={resolvedReportsCount}
              description="Successfully closed issues"
            />
          </div>
          {/* to display in dashboard */}
          <ReportForm onCreateReport={handleCreateReport} />

          {/* Next section placeholder */}
          {updateError && (
            <p role="alert" className="mt-4 text-sm text-rose-700">
              {updateError}
            </p>
          )}

          {loading ? (
            <p className="mt-8 text-sm text-slate-500">Loading reports...</p>
          ) : error ? (
            <p role="alert" className="mt-8 text-sm text-rose-700">
              {error}
            </p>
          ) : (
            <ReportsTable reports={reports} onMarkResolved={markResolved} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
