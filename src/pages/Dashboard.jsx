import React from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import './Dashboard.css';

function Dashboard() {
  
  const profitLossData = [
    { name: 'Jan', profit: 4000, loss: 2400},
    { name: 'Feb', profit: 4000, loss: 2400},
    { name: 'Mar', profit: 4000, loss: 2400},
    { name: 'Apr', profit: 4000, loss: 2400},
    { name: 'May', profit: 4000, loss: 2400},
    { name: 'Jun', profit: 4000, loss: 2400},
    { name: 'Jul', profit: 4000, loss: 2400},
  ];

  const stockData = [
    { name: 'Mon', stock: 120 },
    { name: 'Tue', stock: 120 },
    { name: 'Wed', stock: 120 },
    { name: 'Thu', stock: 120 },
    { name: 'Fri', stock: 120 },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome back, Analyst</h2>
      <div className="cards-grid">
        <Card title="Monthly Revenue" value="$125,430" change="↑ 8.2% from last month" />
        <Card title="Expenses" value="$87,210" change="↓ 2.1% from last month" />
        <Card title="Net Profit" value="$38,220" change="↑ 12.4% from last month" />
      </div>
  
      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart">
          <h3 className="chart-title">Profit & Loss</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitLossData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="loss" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, change }) {
  return (
    <div className="card">
      <h4 className="card-title">{title}</h4>
      <p className="card-value">{value}</p>
      <p className="card-change">{change}</p>
    </div>
  );
}

export default Dashboard;
