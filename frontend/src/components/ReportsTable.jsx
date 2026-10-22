import { useState } from "react";
function ReportsTable({ reports, onMarkResolved }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredReports = reports.filter((report) => {
    const searchableText = [
      report.id,
      report.assetId,
      report.location,
      report.issue,
    ]
      .join(" ")
      .toLowerCase();

//  Search + Status Filter ka logic
//     - matchesSearch check karega ki report tumhari search se match karti hai ya nahi.
// - matchesStatus check karega ki selected status match karta hai ya "All" selected hai.
// - && ka matlab hai ki dono conditions true honi chahiye.
// Example: tum search box mein Ward 04 likhti ho aur dropdown mein Open select karti ho, toh sirf wahi reports dikheingi jo dono conditions match karti hain.
    const matchesSearch = searchableText.includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "All" || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  return (
    <div>
      {/* table ka code yahan aayenga  */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Issue Reports
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest drainage problems recorded in this demo.
          </p>

          <input
            type="text"
            placeholder="Search by report ID, asset ID, location..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
          />

          {/* status dropdown */}
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
          >
            <option value="All">All statuses</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Report ID</th>
                <th className="px-6 py-4 font-semibold">Asset ID</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Issue</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    {searchTerm.trim()
                      ? "No matching reports found."
                      : "No reports available yet."}
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {report.id}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {report.assetId}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {report.location}
                    </td>

                    <td className="px-6 py-4 text-slate-600">{report.issue}</td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {report.status}
                      </span>

                      {/* Status "Open" hai → button dikhega.Status "In Progress" hai → button dikhega.Status "Resolved" hai → button nahi dikhega. */}

                      {report.status !== "Resolved" && (
                        <button
                          type="button"
                          onClick={() => onMarkResolved(report.id)}
                          className="ml-2 rounded-md bg-emerald-700 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-800"
                        >
                          Mark resolved
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default ReportsTable;
