import { useEffect, useState } from "react";
import AssetsTable from "../components/AssetsTable";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");

  // Asset registration form states
  const [formData, setFormData] = useState({
    assetId: "",
    location: "",
    assetType: "Drain",
    assetCondition: "Unknown",
  });

  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  // Register a new drainage asset
  const handleRegisterAsset = async (e) => {
    e.preventDefault();

    setCreateError("");
    setCreateSuccess("");
    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to register asset");
      }

      // Add the newly registered asset to React state
      setAssets((currentAssets) => [...currentAssets, result.data]);

      setCreateSuccess("Asset registered successfully!");

      // Reset form after successful registration
      setFormData({
        assetId: "",
        location: "",
        assetType: "Drain",
        assetCondition: "Unknown",
      });
    } catch (err) {
      console.error("Error registering asset:", err);
      setCreateError(err.message || "Could not register asset.");
    } finally {
      setSubmitting(false);
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

      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-5 text-lg font-semibold">
          Register New Drainage Asset
        </h2>

        <form onSubmit={handleRegisterAsset} className="space-y-4">
          {/* Asset ID */}
          <div>
            <label className="mb-2 block text-sm font-medium">Asset ID</label>

            <input
              type="text"
              value={formData.assetId}
              onChange={(e) =>
                setFormData({ ...formData, assetId: e.target.value })
              }
              placeholder="e.g. DR-092"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-medium">Location</label>

            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g. Sample Ward 26"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          {/* Asset Type */}
          <div>
            <label className="mb-2 block text-sm font-medium">Asset Type</label>

            <input
              type="text"
              value={formData.assetType}
              onChange={(e) =>
                setFormData({ ...formData, assetType: e.target.value })
              }
              placeholder="e.g. Drain"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          {/* Initial Condition */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Initial Condition
            </label>

            <select
              value={formData.assetCondition}
              onChange={(e) =>
                setFormData({ ...formData, assetCondition: e.target.value })
              }
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="Unknown">Unknown</option>
              <option value="Good">Good</option>
              <option value="Needs Maintenance">Needs Maintenance</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          {/* Error message */}
          {createError && (
            <p role="alert" className="text-sm text-rose-700">
              {createError}
            </p>
          )}

          {/* Success message */}
          {createSuccess && (
            <p role="status" className="text-sm text-emerald-700">
              {createSuccess}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {submitting ? "Registering..." : "Register Asset"}
          </button>
        </form>
      </section>

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
