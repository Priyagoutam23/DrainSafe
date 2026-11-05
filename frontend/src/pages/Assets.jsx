import { useEffect, useState } from "react";
import AssetsTable from "../components/AssetsTable";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");

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
        setError("Could not load assets.");
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  // Update asset condition
  const handleUpdateAssetCondition = async (assetId, condition) => {
    setUpdateError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/assets/${assetId}/condition`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ condition }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update condition");
      }

      setAssets((currentAssets) =>
        currentAssets.map((asset) =>
          asset.assetId === assetId ? { ...asset, ...result.data } : asset,
        ),
      );
    } catch (err) {
      console.error("Error updating asset condition:", err);
      setUpdateError(err.message || "Could not update asset condition.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold text-emerald-700">
          DRAINSAFE / ASSETS
        </p>

        <h1 className="mt-2 text-3xl font-bold">Drainage Assets</h1>

        <p className="mt-2 text-slate-500">
          Manage registered drainage infrastructure and monitor its condition.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading assets...</p>
      ) : error ? (
        <p role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      ) : (
        <AssetsTable
          assets={assets}
          onUpdateCondition={handleUpdateAssetCondition}
        />
      )}

      {updateError && (
        <p role="alert" className="mt-3 text-sm text-rose-700">
          {updateError}
        </p>
      )}
    </div>
  );
}

export default Assets;
