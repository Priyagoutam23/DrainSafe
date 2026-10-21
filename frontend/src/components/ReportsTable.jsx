function ReportsTable({ reports, onMarkResolved }){
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
                  {reports.map((report) => (
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

                      <td className="px-6 py-4 text-slate-600">
                        {report.issue}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {report.status}
                        </span>

                        {/* Status "Open" hai → button dikhega.Status "In Progress" hai → button dikhega.Status "Resolved" hai → button nahi dikhega. */}

                        {report.status !== "Resolved" && (
                          <button
                            type="button"
                            onClick={() => onmarkResolved(report.id)}
                            className="ml-2 rounded-md bg-emerald-700 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-800"
                          >
                            Mark resolved
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
    );
}
export default ReportsTable;