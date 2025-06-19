import React, { useEffect, useState } from 'react';
import { getDashboardMetrics, getAllBases, getAllAssets } from '../api';
import { BarChart2, Layers, Activity, Truck, ShoppingBag, DollarSign, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(false);

    const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem('dashboardFilters');
    return saved ? JSON.parse(saved) : { date: '', time: '', base: '', equipmentType: '' };
  });

  useEffect(() => {
    localStorage.setItem('dashboardFilters', JSON.stringify(filters));
  }, [filters]);

  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      let dateTimeFilter = filters.date;
      if (filters.date && filters.time) {
        dateTimeFilter = new Date(`${filters.date}T${filters.time}`).toISOString();
      }

      const response = await getDashboardMetrics({ ...filters, date: dateTimeFilter });
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [filters]);

  useEffect(() => {
    (async () => {
      try {
        const [baseRes, assetRes] = await Promise.all([getAllBases(), getAllAssets()]);
        setBases(baseRes.data);
        setAssets(assetRes.data);
      } catch (err) {
        console.error('Error fetching bases/assets:', err);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading dashboard...</div>;
  if (!stats) return <div className="text-center py-10 text-red-500">Failed to load data.</div>;

  return (
    <div className="p-4 md:p-8 space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        <select name="base" value={filters.base} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="">All Bases</option>
          {bases.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
        <select name="equipmentType" value={filters.equipmentType} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="">All Equipment</option>
          {assets.map((a) => (
            <option key={a._id} value={a.name}>{a.name}</option>
          ))}
        </select>
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon={<Layers />} title="Total Assets" value={stats.totalAssets} />
        <StatCard icon={<PieChart />} title="Total Bases" value={stats.totalBases} />
        <StatCard icon={<BarChart2 />} title="Total Quantity" value={stats.totalAssetQuantity} />
        <StatCard icon={<Truck />} title="Total Transfers" value={stats.totalTransfers} />
        <StatCard icon={<ShoppingBag />} title="Total Purchases" value={stats.totalPurchases} />
        <StatCard icon={<DollarSign />} title="Total Expenditures" value={stats.totalExpenditures} />
        <StatCard
          icon={<Activity />}
          title="Net Movement"
          value={stats.netMovement}
          actionLabel="View"
          onAction={() => setShowBreakdown(true)}
        />
        {stats.baseBalances.map((b) => (
          <React.Fragment key={b.baseId}>
            <StatCard title={`Opening (${b.baseName})`} value={b.openingBalance} />
            <StatCard title={`Closing (${b.baseName})`} value={b.closingBalance} />
          </React.Fragment>
        ))}
      </div>

      {showBreakdown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Net Movement Breakdown</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Purchases: {stats.totalPurchases}</li>
              <li>Transfer In: {stats.totalTransferIn}</li>
              <li>Transfer Out: {stats.totalTransferOut}</li>
              <li className="font-bold text-blue-600">Net Movement: {stats.netMovement}</li>
            </ul>
            <button
              onClick={() => setShowBreakdown(false)}
              className="mt-4 bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Section title="Recent Transfers">
        {stats.recentTransfers.length === 0 ? (
          <EmptyMessage message="No recent transfers." />
        ) : (
          stats.recentTransfers.map((item) => (
            <Card key={item._id}>
              <div className="font-medium text-gray-800">
                {item.assetId?.name} transferred from {item.fromBaseId?.name} to {item.toBaseId?.name}
              </div>
              <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
              <div className="text-xs text-gray-400">{new Date(item.date).toLocaleString()}</div>
            </Card>
          ))
        )}
      </Section>

      <Section title="Recent Expenditures">
        {stats.recentExpenditures.length === 0 ? (
          <EmptyMessage message="No recent expenditures." />
        ) : (
          stats.recentExpenditures.map((item) => (
            <Card key={item._id}>
              <div className="font-medium text-gray-800">
                {item.assetId?.name} — {item.expendType} at {item.baseId?.name}
              </div>
              <div className="text-sm text-gray-500">
                Qty: {item.quantity} {item.expendReason && `| Reason: ${item.expendReason}`}
              </div>
              <div className="text-xs text-gray-400">{new Date(item.date).toLocaleString()}</div>
            </Card>
          ))
        )}
      </Section>
    </div>
  );
};

const StatCard = ({ title, value, icon, actionLabel, onAction }) => (
  <div className="bg-white rounded-xl p-5 shadow hover:shadow-md transition relative">
    <div className="flex items-center gap-3">
      {icon && <div className="text-blue-500">{icon}</div>}
      <div>
        <h2 className="text-sm font-medium text-gray-500">{title}</h2>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
    {actionLabel && onAction && (
      <button onClick={onAction} className="absolute bottom-3 right-3 text-blue-500 text-xs hover:underline">
        {actionLabel}
      </button>
    )}
  </div>
);

const Section = ({ title, children }) => (
  <section>
    <h2 className="text-lg font-semibold mb-3 text-gray-700">{title}</h2>
    <ul className="space-y-2">{children}</ul>
  </section>
);

const Card = ({ children }) => (
  <li className="bg-white p-4 rounded shadow">{children}</li>
);

const EmptyMessage = ({ message }) => (
  <li className="text-center text-gray-400 py-4">{message}</li>
);

export default Dashboard;
