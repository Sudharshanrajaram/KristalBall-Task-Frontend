import React, { useEffect, useState } from 'react';
import {
  getAllAssets,
  getAllBases,
  updateAsset,
  deleteAsset
} from '../api/index';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editAsset, setEditAsset] = useState(null);
  const [form, setForm] = useState({ name: '', type: '', quantity: '', baseId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assetRes, baseRes] = await Promise.all([
        getAllAssets(),
        getAllBases()
      ]);
      setAssets(assetRes.data);
      setBases(baseRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (asset) => {
    setEditAsset(asset);
    setForm({
      name: asset.name,
      type: asset.type,
      quantity: asset.quantity,
      baseId: asset.baseId?._id || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await deleteAsset(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete asset');
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await updateAsset(editAsset._id, form);
      setEditAsset(null);
      fetchData();
    } catch (err) {
      alert('Failed to update asset');
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Assets Overview</h2>

      {loading ? (
        <div className="text-gray-600 text-center">Loading assets...</div>
      ) : (
        <div className="overflow-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 text-sm text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Base</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {assets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No assets found.</td>
                </tr>
              ) : (
                assets.map(asset => (
                  <tr key={asset._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{asset.name}</td>
                    <td className="px-4 py-3">{asset.type}</td>
                    <td className="px-4 py-3">{asset.quantity}</td>
                    <td className="px-4 py-3">{asset.status}</td>
                    <td className="px-4 py-3">{asset.baseId?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleEditClick(asset)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(asset._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

    
      {editAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit Asset</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <select
                value={form.baseId}
                onChange={(e) => setForm({ ...form, baseId: e.target.value })}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Base</option>
                {bases.map((b) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditAsset(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
