function AssetsTable({ assets, onUpdateCondition }) {
  return (
    <section
      id="assets"
      className="mt-8 rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Registered Drainage Assets</h2>
        <p className="mt-1 text-sm text-slate-500">
          Assets stored in the database
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-500">
              <th className="p-3">Asset ID</th>
              <th className="p-3">Location</th>
              <th className="p-3">Asset Type</th>
              <th className="p-3">Condition</th>
            </tr>
          </thead>

          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-500">
                  No assets found.
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.assetId} className="border-b last:border-0">
                  <td className="p-3 font-medium">{asset.assetId}</td>
                  <td className="p-3">{asset.location}</td>
                  <td className="p-3">{asset.assetType}</td>
                  <td className="p-3">
                    <select
                      value={asset.assetCondition}
                      onChange={(e) =>
                        onUpdateCondition(asset.assetId, e.target.value)
                      }
                      className="rounded-lg border border-slate-300 px-2 py-1"
                    >
                      <option value="Unknown">Unknown</option>
                      <option value="Good">Good</option>
                      <option value="Needs Maintenance">
                        Needs Maintenance
                      </option>
                      <option value="Critical">Critical</option>
                    </select>
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

export default AssetsTable;

// assets.map() har asset object ke liye ek table row banata hai. key={asset.assetId} React ko har row uniquely identify karne mein help karta hai.
