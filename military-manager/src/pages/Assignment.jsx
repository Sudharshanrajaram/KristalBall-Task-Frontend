import React, { useEffect, useState } from "react";
import {
  getAssignments,
  assignAsset,
  markAssetExpended,
  getAllAssets,
} from "../api";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [assetId, setAssetId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAssets();
    fetchAssignments();
  }, [filterStatus]);

  const fetchAssets = async () => {
    try {
      const res = await getAllAssets();
      setAssets(res.data);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await getAssignments(filterStatus ? { status: filterStatus } : {});
      setAssignments(res.data);
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assetId || !assignedTo) {
      setError("Both Asset and Assigned To are required.");
      return;
    }

    try {
      await assignAsset({ assetId, assignedTo });
      setAssetId("");
      setAssignedTo("");
      setError("");
      fetchAssignments();
    } catch (err) {
      setError(err.response?.data?.message || "Assignment failed");
    }
  };

  const markAsExpended = async (id) => {
    try {
      await markAssetExpended(id);
      fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark as expended");
    }
  };

  return (
    <div className="p-4">
      <motion.h1
        className="text-2xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Asset Assignments
      </motion.h1>

      {/* Assignment Form */}
      <motion.form
        onSubmit={handleAssign}
        className="mb-6 bg-gray-50 p-6 rounded-lg shadow flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-lg font-medium">Assign New Asset</h2>
        {error && <p className="text-red-600">{error}</p>}

        <select
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          className="p-2 rounded border"
        >
          <option value="">Select Asset</option>
          {assets
            .filter((a) => a.status === "Available")
            .map((asset) => (
              <option key={asset._id} value={asset._id}>
                {asset.name}
              </option>
            ))}
        </select>

        <input
          type="text"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Assigned To"
          className="p-2 rounded border"
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Assign Asset
        </motion.button>
      </motion.form>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 rounded border"
        >
          <option value="">All Status</option>
          <option value="Assigned">Assigned</option>
          <option value="Expended">Expended</option>
        </select>
      </div>

      {/* Assignment List */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr className="text-left text-gray-700">
              <th className="p-3">Asset</th>
              <th className="p-3">Assigned To</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {assignments.map((a) => (
                <motion.tr
                  key={a._id}
                  className="border-t"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <td className="p-3">{a.assetId?.name || "N/A"}</td>
                  <td className="p-3">{a.assignedTo}</td>
                  <td className="p-3">{a.status}</td>
                  <td className="p-3">
                    {a.assignedAt
                      ? format(new Date(a.assignedAt), "dd/MM/yyyy")
                      : "N/A"}
                    {a.status === "Expended" && a.expendedAt && (
                      <div className="text-xs text-gray-500">
                        (Expended: {format(new Date(a.expendedAt), "dd/MM/yyyy")})
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    {a.status === "Assigned" && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markAsExpended(a._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Mark Expended
                      </motion.button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>

            {assignments.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignments;
