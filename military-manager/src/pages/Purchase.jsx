import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllBases, getAllAssets, getAllPurchases, createPurchase } from '../api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const Purchase = () => {
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [isNewAsset, setIsNewAsset] = useState(true);

  const [formData, setFormData] = useState({
    baseId: '',
    name: '',
    type: '',
    assetId: '',
    quantity: '',
    costPerUnit: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [baseRes, assetRes, purchaseRes] = await Promise.all([
          getAllBases(),
          getAllAssets(),
          getAllPurchases()
        ]);
        setBases(baseRes.data);
        setAssets(assetRes.data);
        setPurchases(purchaseRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'assetId') {
      const asset = assets.find((a) => a._id === value);
      if (asset) {
        setFormData((prev) => ({
          ...prev,
          assetId: value,
          name: asset.name,
          type: asset.type
        }));
      } else {
        setFormData((prev) => ({ ...prev, assetId: value }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const quantity = Number(formData.quantity);
      const costPerUnit = Number(formData.costPerUnit);

      const payload = {
        ...formData,
        isNewAsset,
        quantity,
        costPerUnit,
        totalCost: quantity * costPerUnit,
        date: new Date().toISOString()
      };

      await createPurchase(payload);
      alert('Purchase successful');
      window.location.reload();
    } catch (err) {
      alert('Purchase failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-4 md:p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🛒 Purchase Asset</h2>

      <motion.form
        onSubmit={handleSubmit}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-md p-6 rounded-lg"
      >
        <div className="md:col-span-2 flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="assetMode"
              checked={isNewAsset}
              onChange={() => setIsNewAsset(true)}
            />
            <span className="text-gray-700">New Asset</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="assetMode"
              checked={!isNewAsset}
              onChange={() => setIsNewAsset(false)}
            />
            <span className="text-gray-700">Existing Asset</span>
          </label>
        </div>

        <select
          name="baseId"
          value={formData.baseId}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Select Base</option>
          {bases.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>

        {isNewAsset ? (
          <>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Asset Name"
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Asset Type"
              required
              className="border p-2 rounded"
            />
          </>
        ) : (
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
                {a.name} ({a.type})
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="costPerUnit"
          value={formData.costPerUnit}
          onChange={handleChange}
          placeholder="Cost Per Unit"
          required
          className="border p-2 rounded"
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="md:col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200"
        >
          Submit Purchase
        </motion.button>
      </motion.form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">🧾 Recent Purchases</h3>
        <ul className="space-y-3">
          {purchases.slice(0, 5).map((p, index) => (
            <motion.li
              key={p._id}
              className="p-4 bg-gray-50 rounded shadow-sm"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 * index }}
            >
              <div className="font-medium text-gray-800">
                {p.assetId?.name || p.name} ({p.assetId?.type || p.type}) for <strong>{p.baseId?.name}</strong>
              </div>
              <div className="text-sm text-gray-600">
                Qty: {p.quantity}, Cost/unit: ₹{p.costPerUnit}, Total: ₹{p.totalCost}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(p.date).toLocaleString()}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Purchase;
