import React from "react";
import { motion } from "framer-motion";
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

// =================== SAMPLE DATA ===================
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

// =================== RISK HELPER (COLOR + LABEL) ===================
function getRiskData(percentage) {
  // Default to Low
  let label = "Low";
  let color = "#10B981"; // Green

  if (percentage >= 80) {
    label = "High";
    color = "#EF4444"; // Red
  } else if (percentage >= 40) {
    label = "Medium";
    color = "#F59E0B"; // Yellow
  }

  return { label, color };
}

// =================== DOTTED CIRCULAR PROGRESS ===================
function DottedCircularProgress({
  percentage = 75,
  size = 100,
  segments = 20,    // Number of dots
  dotRadius = 4,    // Size of each dot
}) {
  // how many dots are "active"?
  const activeCount = Math.round((percentage / 100) * segments);

  // figure out color + label automatically
  const { label: riskLabel, color: activeColor } = getRiskData(percentage);

  // place the ring
  const ringRadius = size / 2 - dotRadius - 2;
  const center = size / 2;
  const inactiveColor = "#e5e7eb";

  // build array of dot indices
  const dots = Array.from({ length: segments }, (_, i) => i);

  return (
    <svg width={size} height={size} className="dotted-circular-progress">
      {dots.map((i) => {
        const angle = (2 * Math.PI * i) / segments;
        const x = center + ringRadius * Math.cos(angle);
        const y = center + ringRadius * Math.sin(angle);
        const fillColor = i < activeCount ? activeColor : inactiveColor;
        return <circle key={i} cx={x} cy={y} r={dotRadius} fill={fillColor} />;
      })}
      {/* Centered text (percentage) */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="16"
        fill="#1f2937"
        fontWeight="500"
      >
        {percentage}%
      </text>
    </svg>
  );
}

// =================== REUSABLE CARD COMPONENT ===================
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

// =================== MAIN DASHBOARD ===================
export default function Dashboard() {
  // riskScore is a percentage from 0 to 100
  const riskScore = 100; // Try changing to 20, 50, 90, etc.

  // We automatically determine risk color & label from the percentage
  const { label: riskLabel } = getRiskData(riskScore);

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
          <DottedCircularProgress
            percentage={riskScore}
            size={120}     
            segments={20}  
            dotRadius={4}  
          />
          <p className="risk-label">
            Risk: {riskScore} / 100 ({riskLabel})
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
