import React from "react";
import { motion } from "framer-motion"; // <-- Import from framer-motion
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./Dashboard.css";

// SAMPLE DATA
const profitLossData = [
  { name: "Jan", revenue: 12000, expenses: 9000 },
  { name: "Feb", revenue: 15000, expenses: 11000 },
  { name: "Mar", revenue: 14000, expenses: 10000 },
  { name: "Apr", revenue: 18000, expenses: 13000 },
  { name: "May", revenue: 20000, expenses: 16000 },
];

const stockData = [
  { name: "Mon", stock: 120 },
  { name: "Tue", stock: 115 },
  { name: "Wed", stock: 123 },
  { name: "Thu", stock: 130 },
  { name: "Fri", stock: 127 },
];

const invoices = [
  { id: "INV-001", client: "Acme Co", amount: "$5,400", status: "Paid" },
  { id: "INV-002", client: "Beta Ltd", amount: "$12,000", status: "Unpaid" },
  { id: "INV-003", client: "Gamma Inc", amount: "$7,600", status: "Overdue" },
];

const cardsData = [
  { title: "Monthly Revenue", value: "$125,430", change: "↑ 8.2% from last month" },
  { title: "Expenses", value: "$87,210", change: "↓ 2.1% from last month" },
  { title: "Net Profit", value: "$38,220", change: "↑ 12.4% from last month" },
];

const goals = [
  { label: "Increase Revenue", goal: 15000, current: 12000 },
  { label: "Reduce Expenses", goal: 8000, current: 7000 },
];

// CIRCULAR PROGRESS BAR
function CircularProgress({ percentage, size }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <svg width={size} height={size} className="circular-progress">
      <circle
        className="circular-progress-bg"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="circular-progress-bar"
        stroke="#EF4444"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="circular-progress-text"
      >
        {percentage}%
      </text>
    </svg>
  );
}

// REUSABLE CARD COMPONENT
// Now using motion.div with a hover scale effect
function Card({ title, value, change }) {
  return (
    <motion.div
      className="card"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <h4 className="card-title">{title}</h4>
      <p className="card-value">{value}</p>
      <p className="card-change">{change}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  // Example risk score (75 out of 100)
  const riskScore = 75;
  const riskLevel = "High";

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome back, Analyst!</h2>

      {/* ========== ROW 1: RISK & GOAL ========== */}
      <div className="top-row">
        {/* Risk Score Card */}
        <motion.div
          className="risk-card"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="section-title">Risk Score</h3>
          <CircularProgress percentage={riskScore} size={120} />
          <p className="risk-label">
            Risk: {riskScore} / 100 ({riskLevel})
          </p>
        </motion.div>

        {/* Goal vs Current State */}
        <motion.div
          className="goal-card"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="section-title">Goal vs Current State</h3>
          <ul className="goal-list">
            {goals.map((item, idx) => {
              const progress = Math.floor((item.current / item.goal) * 100);
              return (
                <li key={idx} className="goal-item">
                  <span className="goal-label">{item.label}</span>
                  <span className="goal-values">
                    {item.current} / {item.goal}
                  </span>
                  <div className="goal-progress">
                    <div className="goal-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <span className="goal-percentage">{progress}%</span>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>

      {/* ========== ROW 2: INFO CARDS ========== */}
      <div className="cards-grid">
        {cardsData.map((c, i) => (
          <Card key={i} title={c.title} value={c.value} change={c.change} />
        ))}
      </div>

      {/* ========== ROW 3: CHARTS ========== */}
      <div className="charts-row">
        {/* Profit & Loss */}
        <motion.div
          className="chart"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="chart-title">Profit & Loss Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={profitLossData}
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#EF4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Stock Tracker */}
        <motion.div
          className="chart"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="chart-title">Stock Tracker</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={stockData}
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="stock" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ========== ROW 4: INVOICES ========== */}
      <motion.div
        className="invoices-section"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="invoices-title">Invoices</h3>
        <table className="invoices-table">
          <thead>
            <tr className="invoices-table-header">
              <th>Invoice ID</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="invoices-table-row">
                <td>{inv.id}</td>
                <td>{inv.client}</td>
                <td>{inv.amount}</td>
                <td>
                  <span className={`invoice-status ${inv.status.toLowerCase()}`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
