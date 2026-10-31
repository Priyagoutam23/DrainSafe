function RepeatFailureTable({ repeatFailures }) {
  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">
          Repeat-Failure Alerts
        </h2>
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
            </tr>
          </thead>

          <tbody>
            {repeatFailures.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-500">
                  No repeat failures detected.
                </td>
              </tr>
            ) : (
              repeatFailures.map((failure) => (
                <tr key={`${failure.assetId}-${failure.issue}`} className="border-b last:border-0">
                  <td className="p-3 font-medium">{failure.assetId}</td>
                  <td className="p-3">{failure.location}</td>
                  <td className="p-3">{failure.issue}</td>
                  <td className="p-3 font-semibold text-rose-700">
                    {failure.reportCount}
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