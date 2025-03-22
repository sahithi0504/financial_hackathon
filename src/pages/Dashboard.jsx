import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
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

// =================== GOALS & INVOICES (unchanged) ===================
const goals = [
  { label: "Increase Revenue", goal: 15000, current: 12000 },
  { label: "Reduce Expenses", goal: 8000, current: 7000 },
];

const invoices = [
  { id: "INV-001", client: "Acme Co", amount: "$5,400", status: "Paid" },
  { id: "INV-002", client: "Beta Ltd", amount: "$12,000", status: "Unpaid" },
  { id: "INV-003", client: "Gamma Inc", amount: "$7,600", status: "Overdue" },
];

// =================== PLACEHOLDER STOCK DATA ===================
const stockData = [
  { name: "Mon", stock: 120 },
  { name: "Tue", stock: 175 },
  { name: "Wed", stock: 93 },
  { name: "Thu", stock: 137 },
  { name: "Fri", stock: 107 },
  { name: "Sat", stock: 157 },
  { name: "Sun", stock: 139 },
];

// =================== RISK SCORE (example) ===================
function getRiskColorByPercentage(percentage) {
  if (percentage >= 80) return "#EF4444"; // High
  if (percentage >= 40) return "#F59E0B"; // Medium
  return "#10B981"; // Low
}

// New helper to get text label for risk
function getRiskLabel(percentage) {
  if (percentage >= 80) return "High";
  if (percentage >= 40) return "Medium";
  return "Low";
}

function DottedCircularProgress({
  percentage = 85,
  size = 100,
  segments = 20,
  dotRadius = 4,
}) {
  const activeCount = Math.round((percentage / 100) * segments);
  const activeColor = getRiskColorByPercentage(percentage);
  const inactiveColor = "#e5e7eb";
  const ringRadius = size / 2 - dotRadius - 2;
  const center = size / 2;
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
  // CSV-based data for Profit & Loss
  const [plData, setPlData] = useState([]);
  const [loading, setLoading] = useState(true);

  // For Risk Score (example)
  const riskScore = 9;

  // 1) LOAD & PARSE CSV ON MOUNT
  useEffect(() => {
    fetch("/quarterly_data.csv")
      .then((response) => response.text())
      .then((csvString) => {
        const parsed = Papa.parse(csvString, { header: true });
        const rows = parsed.data
          .filter((row) => row["Date "] || row["Date"])
          .map((row) => {
            const rawDate = row["Date "] || row["Date"] || "";
            const date = rawDate.trim();

            const rawRevenue = (row["Revenue"] || "0").replace(/,/g, "");
            const rawExpenses = (row["Operating Expenses"] || "0").replace(/,/g, "");
            const rawNetIncome = (row["Net Income"] || "0").replace(/,/g, "");

            return {
              date,
              revenue: Number(rawRevenue),
              expenses: Number(rawExpenses),
              netIncome: Number(rawNetIncome),
            };
          });

        setPlData(rows);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading CSV:", err);
        setLoading(false);
      });
  }, []);

  // 2) DERIVE QUARTERLY VALUES from the LATEST ROW
  let quarterlyRevenue = "$0";
  let quarterlyExpenses = "$0";
  let quarterlyNetIncome = "$0";
  let quarterlyChange = "↑ 5.2% from last quarter";

  if (plData.length > 0) {
    const lastRow = plData[plData.length - 1];
    quarterlyRevenue = `$${lastRow.revenue.toLocaleString()}`;
    quarterlyExpenses = `$${lastRow.expenses.toLocaleString()}`;
    quarterlyNetIncome = `$${lastRow.netIncome.toLocaleString()}`;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome back, Analyst!</h2>

      {/* ===== ROW 1: RISK & GOALS ===== */}
      <div className="top-row">
        {/* Risk Score Card */}
        <motion.div
          className="risk-card"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="section-title">Risk Score</h3>
          <DottedCircularProgress percentage={riskScore} />
          {/* Show risk label instead of percentage */}
          <p className="risk-label">Risk: {getRiskLabel(riskScore)}</p>
        </motion.div>

        {/* Goals */}
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

      {/* ===== ROW 2: INFO CARDS (Quarterly Revenue, Operating Expenses, Net Income) ===== */}
      <div className="cards-grid">
        <Card
          title="Quarterly Revenue"
          value={quarterlyRevenue}
          change={quarterlyChange}
        />
        <Card
          title="Operating Expenses"
          value={quarterlyExpenses}
          change="↓ 2.1% from last quarter"
        />
        <Card
          title="Net Profit"
          value={quarterlyNetIncome}
          change="↑ 3.4% from last quarter"
        />
      </div>

      {/* ===== ROW 3: CHARTS (Profit & Loss, Stock Tracker) ===== */}
      <div className="charts-row">
        {/* Profit & Loss as a STACKED BAR CHART */}
        <motion.div
          className="chart"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="chart-title">
            Profit & Loss Overview (Quarterly)
          </h3>
          {loading ? (
            <p>Loading CSV data...</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={plData}
                margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                {/* stackId="pnl" means they stack */}
                <Bar dataKey="expenses" stackId="pnl" fill="#EF4444" />
                <Bar dataKey="revenue" stackId="pnl" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          )}
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
              <Line type="linear" dataKey="stock" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ===== ROW 4: INVOICES ===== */}
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