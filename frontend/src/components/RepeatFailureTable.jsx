function RepeatFailureTable({ repeatFailures }) {
  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Repeat-Failure Alerts</h2>
        <p className="mt-1 text-sm text-slate-500">
          Drainage assets with recurring issues
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-500">
              <th className="p-3">Asset ID</th>
              <th className="p-3">Location</th>
              <th className="p-3">Issue</th>
              <th className="p-3">Report Count</th>
              <th className="p-3">Last Reported</th>
              <th className="p-3">Priority</th>
            </tr>
          </thead>

          <tbody>
            {repeatFailures.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-slate-500">
                  No repeat failures detected.
                </td>
              </tr>
            ) : (
              repeatFailures.map((failure) => (
                <tr
                  key={`${failure.assetId}-${failure.issue}`}
                  className="border-b last:border-0"
                >
                  <td className="p-3 font-medium">{failure.assetId}</td>
                  <td className="p-3">{failure.location}</td>
                  <td className="p-3">{failure.issue}</td>
                  <td className="p-3 font-semibold text-rose-700">
                    {failure.reportCount}
                  </td>
                  <td className="p-3">
                    {new Date(failure.lastReportedAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </td>

                  <td className="p-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        failure.priority === "Critical"
                          ? "bg-rose-100 text-rose-700"
                          : failure.priority === "High"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {failure.priority}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RepeatFailureTable;
