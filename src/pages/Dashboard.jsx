import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome back, Analyst</h2>
      <div className="cards-grid">
        <Card title="Monthly Revenue" value="$125,430" change="↑ 8.2% from last month" />
        <Card title="Expenses" value="$87,210" change="↓ 2.1% from last month" />
        <Card title="Net Profit" value="$38,220" change="↑ 12.4% from last month" />
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
