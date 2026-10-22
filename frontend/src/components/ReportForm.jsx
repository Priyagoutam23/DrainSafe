import { useState } from "react";

function ReportForm({ onCreateReport }) {
  const [assetId, setAssetId] = useState("");
  const [location, setLocation] = useState("");
  const [issue, setIssue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);

    const created = await onCreateReport({
      assetId: assetId.trim(),
      location: location.trim(),
      issue: issue.trim(),
    });

    if (created) {
      setAssetId("");
      setLocation("");
      setIssue("");
    }

    setSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Add New Report</h2>

      <p className="mt-1 text-sm text-slate-500">
        Record a new drainage issue.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="assetId"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Asset ID
          </label>

          <input
            id="assetId"
            value={assetId}
            onChange={(event) => setAssetId(event.target.value)}
            placeholder="e.g. DR-030"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Location
          </label>

          <input
            id="location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="e.g. Sample Ward 09"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="issue"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Issue description
          </label>

          <input
            id="issue"
            value={issue}
            onChange={(event) => setIssue(event.target.value)}
            placeholder="e.g. Blocked drain"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Creating report..." : "Create Report"}
      </button>
    </form>
  );
}

export default ReportForm;
