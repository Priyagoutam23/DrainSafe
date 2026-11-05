import { useEffect, useState } from "react";

function getLocalDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Maintenance() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("all");
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState("");
  // States for registered assets
  const [assets, setAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetsError, setAssetsError] = useState("");
  //Create form states
  const [formData, setFormData] = useState({
    assetId: "",
    activityType: "",
    description: "",
    activityDate: getLocalDate(),
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Fetch maintenance history from backend
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/assets/history",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch maintenance history");
        }

        const result = await response.json();
        setHistory(result.data);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Could not load maintenance history.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Fetch maintenance activities
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/maintenance");

        if (!response.ok) {
          throw new Error("Failed to fetch maintenance activities");
        }

        const result = await response.json();
        setActivities(result.data);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setActivityError("Could not load maintenance activities.");
      } finally {
        setActivityLoading(false);
      }
    };

    loadActivities();
  }, []);

  // Fetch registered assets
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/assets");

        if (!response.ok) {
          throw new Error("Failed to fetch assets");
        }

        const result = await response.json();
        setAssets(result.data);
      } catch (err) {
        console.error("Error fetching assets:", err);
        setAssetsError("Could not load registered assets.");
      } finally {
        setAssetsLoading(false);
      }
    };

    loadAssets();
  }, []);
  //Step 2 — Filter logic
  const filteredHistory =
    selectedAsset === "all"
      ? history
      : history.filter((record) => record.assetId === selectedAsset);

  const assetIds = [...new Set(history.map((record) => record.assetId))];

  //Create handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setFormSuccess("");
    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create activity");
      }

      // Refresh maintenance records
      const refreshResponse = await fetch(
        "http://localhost:5000/api/maintenance",
      );

      if (!refreshResponse.ok) {
        throw new Error("Activity saved, but refreshing records failed.");
      }

      const refreshedData = await refreshResponse.json();
      setActivities(refreshedData.data);

      setFormSuccess("Maintenance activity created successfully!");

      setFormData({
        assetId: "",
        activityType: "",
        description: "",
        activityDate: getLocalDate(),
      });
    } catch (err) {
      console.error("Error creating activity:", err);
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold text-emerald-700">
          DRAINSAFE / MAINTENANCE
        </p>

        <h1 className="mt-2 text-3xl font-bold">Maintenance History</h1>

        <p className="mt-2 text-slate-500">
          Track condition changes across drainage assets.
        </p>
      </div>
      {/* Create Maintenance Activity */}
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-5 text-lg font-semibold">Add Maintenance Activity</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Asset ID</label>

            <select
              value={formData.assetId}
              onChange={(e) =>
                setFormData({ ...formData, assetId: e.target.value })
              }
              required
              disabled={assetsLoading || assets.length === 0}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="" disabled>
                {assetsLoading ? "Loading assets..." : "Select an asset"}
              </option>

              {assets.map((asset) => (
                <option key={asset.assetId} value={asset.assetId}>
                  {asset.assetId} — {asset.location}
                </option>
              ))}
            </select>

            {assetsError && (
              <p className="mt-2 text-sm text-rose-700">{assetsError}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Activity Type
            </label>

            <select
              value={formData.activityType}
              onChange={(e) =>
                setFormData({ ...formData, activityType: e.target.value })
              }
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="" disabled>
                Select activity type
              </option>
              <option value="Cleaning">Cleaning</option>
              <option value="Repair">Repair</option>
              <option value="Inspection">Inspection</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the maintenance work..."
              required
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Activity Date
            </label>

            <input
              type="date"
              value={formData.activityDate}
              onChange={(e) =>
                setFormData({ ...formData, activityDate: e.target.value })
              }
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          {formError && <p className="text-sm text-rose-700">{formError}</p>}

          {formSuccess && (
            <p className="text-sm text-emerald-700">{formSuccess}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Activity"}
          </button>
        </form>
      </section>

      {/* Existing Condition History */}
      {loading ? (
        <p className="text-sm text-slate-500">Loading maintenance history...</p>
      ) : error ? (
        <p role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-5">
          {/* //Step 3 — Dropdown */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium">
              Filter by Asset
            </label>

            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="all">All Assets</option>

              {assetIds.map((assetId) => (
                <option key={assetId} value={assetId}>
                  {assetId}
                </option>
              ))}
            </select>
          </div>
          <h2 className="mb-5 text-lg font-semibold">
            Asset Condition History
          </h2>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-slate-500">
                <th className="p-3">Asset ID</th>
                <th className="p-3">Location</th>
                <th className="p-3">Previous Condition</th>
                <th className="p-3">New Condition</th>
                <th className="p-3">Changed At</th>
              </tr>
            </thead>

            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-slate-500">
                    No maintenance history found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((record) => (
                  <tr key={record.historyId} className="border-b last:border-0">
                    <td className="p-3 font-medium">{record.assetId}</td>

                    <td className="p-3">{record.location}</td>

                    <td className="p-3">{record.previousCondition}</td>

                    <td className="p-3 font-medium text-emerald-700">
                      {record.newCondition}
                    </td>

                    <td className="p-3 text-slate-500">
                      {new Date(record.changedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Actual Maintenance Activities */}
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-5 text-lg font-semibold">Maintenance Activities</h2>

        {activityLoading ? (
          <p>Loading activities...</p>
        ) : activityError ? (
          <p className="text-rose-700">{activityError}</p>
        ) : activities.length === 0 ? (
          <p className="text-slate-500">No maintenance activities found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-500">
                  <th className="p-3">Asset ID</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Activity</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Activity Date</th>
                </tr>
              </thead>

              <tbody>
                {activities.map((activity) => (
                  <tr
                    key={activity.activityId}
                    className="border-b last:border-0"
                  >
                    <td className="p-3 font-medium">{activity.assetId}</td>
                    <td className="p-3">{activity.location}</td>
                    <td className="p-3">{activity.activityType}</td>
                    <td className="p-3">{activity.description}</td>
                    <td className="p-3">
                      {new Date(activity.activityDate).toLocaleDateString(
                        "en-IN",
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Maintenance;
