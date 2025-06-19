import React, { useState, useEffect } from 'react';
import {
  getAllAssets,
  getAllBases,
  getAllTransfers,
  createTransfer
} from '../api';

const Transfer = () => {
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [formData, setFormData] = useState({
    assetId: '',
    fromBaseId: '',
    toBaseId: '',
    quantity: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assetRes, baseRes, transferRes] = await Promise.all([
        getAllAssets(),
        getAllBases(),
        getAllTransfers()
      ]);
      setAssets(assetRes.data);
      setBases(baseRes.data);
      setTransfers(transferRes.data);
    } catch (err) {
      console.error('Error fetching transfer data:', err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.fromBaseId === formData.toBaseId) {
      return alert('⚠️ From and To base must be different');
    }

    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity)
      };

      await createTransfer(payload);
      alert('✅ Transfer successful!');
      setFormData({ assetId: '', fromBaseId: '', toBaseId: '', quantity: '' });

      await fetchData(); // Re-fetch to get populated fields
    } catch (err) {
      alert('❌ Transfer failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🔁 Transfer Assets</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md"
      >
        <select
          name="assetId"
          value={formData.assetId}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        >
          <option value="">Select Asset</option>
          {assets.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name} - {a.type}
            </option>
          ))}
        </select>

        <select
          name="fromBaseId"
          value={formData.fromBaseId}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        >
          <option value="">From Base</option>
          {bases.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          name="toBaseId"
          value={formData.toBaseId}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        >
          <option value="">To Base</option>
          {bases.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          min={1}
          className="p-2 border rounded"
        />

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Transfer
          </button>
        </div>
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">📦 Recent Transfers</h3>
        <div className="space-y-3">
          {transfers.length > 0 ? (
            transfers
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map((t) => (
                <div key={t._id} className="p-4 bg-gray-50 rounded shadow-sm">
                  <div className="text-gray-800 font-medium">
                    {t.assetId?.name || 'Unknown asset'} transferred from{' '}
                    <span className="font-semibold">{t.fromBaseId?.name || 'Unknown base'}</span>{' '}
                    to{' '}
                    <span className="font-semibold">{t.toBaseId?.name || 'Unknown base'}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Qty: {t.quantity} | {new Date(t.date).toLocaleString()}
                  </div>
                </div>
              ))
          ) : (
            <div className="text-gray-500 text-sm">No transfers found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transfer;
