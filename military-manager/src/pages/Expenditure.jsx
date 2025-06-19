import React, { useEffect, useState } from 'react';
import {
  getAllAssets,
  getAllBases,
  getAllExpenditures,
  createExpenditure
} from '../api';

const Expenditure = () => {
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    assetId: '',
    baseId: '',
    quantity: '',
    expendType: 'Used',
    expendReason: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetRes, baseRes, expRes] = await Promise.all([
          getAllAssets(),
          getAllBases(),
          getAllExpenditures()
        ]);
        setAssets(assetRes.data);
        setBases(baseRes.data);
        setExpenditures(expRes.data);
      } catch (err) {
        alert('Failed to load data: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity, 10)
      };
      await createExpenditure(payload);
      alert('Expenditure recorded successfully');
      window.location.reload();
    } catch (err) {
      alert('Failed to record expenditure: ' + (err.response?.data?.message || err.message));
      console.error('Expenditure Error:', err);
      console.error('Payload:', formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Record Expenditure</h2>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow"
          >
            <select
              name="assetId"
              value={formData.assetId}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            >
              <option value="">Select Asset</option>
              {assets.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name} - {a.type}
                </option>
              ))}
            </select>

            <select
              name="baseId"
              value={formData.baseId}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            >
              <option value="">Select Base</option>
              {bases.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className="border p-2 rounded"
              required
            />

            <select
              name="expendType"
              value={formData.expendType}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="Used">Used</option>
              <option value="Transfered">Transfered</option>
              <option value="Expired">Expired</option>
            </select>

            <input
              type="text"
              name="expendReason"
              value={formData.expendReason}
              onChange={handleChange}
              placeholder="Reason"
              className="border p-2 rounded col-span-full"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          <div className="mt-10">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Recent Expenditures</h3>
            {expenditures.length === 0 ? (
              <div className="text-gray-500">No expenditures recorded yet.</div>
            ) : (
              <ul className="space-y-3">
                {expenditures.slice(0, 5).map((e) => (
                  <li key={e._id} className="p-4 bg-gray-100 rounded text-sm">
                    <div className="font-medium">{e.assetId?.name} ({e.assetId?.type})</div>
                    <div className="text-gray-600">
                      {e.expendType.toLowerCase()} at {e.baseId?.name} - Quantity: {e.quantity}
                    </div>
                    <div className="text-xs text-gray-500">{new Date(e.date).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Expenditure;
