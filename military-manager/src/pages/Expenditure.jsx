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
        console.error('Error fetching expenditure data:', err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity, 10)
      };

      await createExpenditure(payload);
      alert('Expenditure recorded');
      window.location.reload();
    } catch (err) {
      alert('Expenditure failed: ' + err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Record Expenditure</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow p-6 rounded-lg">
        <select name="assetId" value={formData.assetId} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Select Asset</option>
          {assets.map((a) => (
            <option key={a._id} value={a._id}>{a.name} - {a.type}</option>
          ))}
        </select>

        <select name="baseId" value={formData.baseId} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Select Base</option>
          {bases.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
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

        <select name="expendType" value={formData.expendType} onChange={handleChange} className="border p-2 rounded">
          <option value="Used">Used</option>
          <option value="Transfered">Transfered</option>
        </select>

        <input
          type="text"
          name="expendReason"
          value={formData.expendReason}
          onChange={handleChange}
          placeholder="Reason"
          className="border p-2 rounded col-span-full"
        />

        <button type="submit" className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-medium text-gray-700 mb-4">Recent Expenditures</h3>
        <ul className="space-y-3">
          {expenditures.slice(0, 5).map((e) => (
            <li key={e._id} className="p-4 bg-gray-100 rounded">
              <div>{e.assetId?.name} ({e.assetId?.type}) {e.expendType.toLowerCase()} at {e.baseId?.name}</div>
              <div className="text-sm text-gray-500">Quantity: {e.quantity}</div>
              <div className="text-xs text-gray-400">{new Date(e.date).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Expenditure;
