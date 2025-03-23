
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Papa from "papaparse";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import "./Dashboard.css";

const goals = [
  { label: "Increase Revenue", goal: 15000, current: 12000 },
  { label: "Reduce Expenses", goal: 8000, current: 7000 },
];

function getRiskColorByPercentage(percentage) {
  if (percentage >= 80) return "#EF4444";
  if (percentage >= 40) return "#F59E0B";
  return "#10B981";
}

function getRiskLabel(percentage) {
  if (percentage >= 80) return "High";
  if (percentage >= 40) return "Medium";
  return "Low";
}

function DottedCircularProgress({ percentage = 85, size = 100, segments = 20, dotRadius = 4 }) {
  const activeCount = Math.round((percentage / 100) * segments);
  const activeColor = getRiskColorByPercentage(percentage);
  const inactiveColor = "#e5e7eb";
  const ringRadius = size / 2 - dotRadius - 2;
  const center = size / 2;

  return (
    <svg width={size} height={size} className="dotted-circular-progress">
      {Array.from({ length: segments }).map((_, i) => {
        const angle = (2 * Math.PI * i) / segments;
        const x = center + ringRadius * Math.cos(angle);
        const y = center + ringRadius * Math.sin(angle);
        const fill = i < activeCount ? activeColor : inactiveColor;
        return <circle key={i} cx={x} cy={y} r={dotRadius} fill={fill} />;
      })}
      <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="16" fill="#1f2937" fontWeight="500">
        {percentage}%
      </text>
    </svg>
  );
}

function Card({ title, value, change }) {
  return (
    <motion.div className="card" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
      <h4 className="card-title">{title}</h4>
      <p className="card-value">{value}</p>
      <p className="card-change">{change}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const [plData, setPlData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const riskScore = 19;
  const [revenueImg, setRevenueImg] = useState(null);
  const [expensesImg, setExpensesImg] = useState(null);
  const [netIncomeImg, setNetIncomeImg] = useState(null);



  useEffect(() => {
    // Fetch invoice data from backend
    fetch("http://127.0.0.1:8000/risky_customers_json")
      .then(res => res.json())
      .then(data => {
        // Modify this part if your backend format is different
        const rows = data.slice(0, 7).map(row => ({
          id: row.customer_id,
          count: row.invoice_count,
          amount: `$${parseFloat(row.total_spend).toFixed(2)}`,
          status: row.risk_flag === "1" ? "High" : "Low"
        }));
        setInvoiceData(rows);
        setLoading(false);
      });
  
    // Fetch stock chart image
    fetch("http://127.0.0.1:8000/stock_trend_graph")
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setStockData([{ name: "Stock Chart", imageUrl: url }]); // just for display
      });
  
    // Optional: fetch forecast images if you want to show them
    fetch("http://127.0.0.1:8000/revenue_forecast")
      .then(res => res.blob())
      .then(blob => setRevenueImg(URL.createObjectURL(blob)));
  
    fetch("http://127.0.0.1:8000/operating_expenses_forecast")
      .then(res => res.blob())
      .then(blob => setExpensesImg(URL.createObjectURL(blob)));
  
    fetch("http://127.0.0.1:8000/net_income_forecast")
      .then(res => res.blob())
      .then(blob => setNetIncomeImg(URL.createObjectURL(blob)));
  }, []);
  

  const last = plData[plData.length - 1] || {};
  const quarterlyRevenue = last.revenue ? `$${last.revenue.toLocaleString()}` : "$0";
  const quarterlyExpenses = last.expenses ? `$${last.expenses.toLocaleString()}` : "$0";
  const quarterlyNetIncome = last.netIncome ? `$${last.netIncome.toLocaleString()}` : "$0";

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome back, Analyst!</h2>

      <div className="top-row">
        <motion.div className="risk-card" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
          <h3 className="section-title">Risk Score</h3>
          <DottedCircularProgress percentage={riskScore} />
          <p className="risk-label">Risk: {getRiskLabel(riskScore)}</p>
        </motion.div>

        <motion.div className="goal-card" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
          <h3 className="section-title">Goal vs Current State</h3>
          <ul className="goal-list">
            {goals.map((g, i) => {
              const pct = Math.floor((g.current / g.goal) * 100);
              return (
                <li key={i} className="goal-item">
                  <span className="goal-label">{g.label}</span>
                  <span className="goal-values">{g.current} / {g.goal}</span>
                  <div className="goal-progress">
                    <div className="goal-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="goal-percentage">{pct}%</span>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>

      <div className="cards-grid">
        <Card title="Quarterly Revenue" value={quarterlyRevenue} change="↑ 5.2% from last quarter" />
        <Card title="Operating Expenses" value={quarterlyExpenses} change="↓ 2.1% from last quarter" />
        <Card title="Net Profit" value={quarterlyNetIncome} change="↑ 3.4% from last quarter" />
      </div>

      <div className="charts-row">
        <motion.div className="chart" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
          <h3 className="chart-title">Profit & Loss Overview (Quarterly)</h3>
          {loading ? <p>Loading...</p> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={plData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="expenses" stackId="pnl" fill="#EF4444" />
                <Bar dataKey="revenue" stackId="pnl" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div className="chart" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
          <h3 className="chart-title">Stock Tracker</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Line type="linear" dataKey="stock" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="forecast-charts">
        {revenueImg && <img src={revenueImg} alt="Revenue Forecast" />}
        {expensesImg && <img src={expensesImg} alt="Expenses Forecast" />}
        {netIncomeImg && <img src={netIncomeImg} alt="Net Income Forecast" />}
        </div>


      <motion.div className="invoices-section" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
        <h3 className="invoices-title">Invoices</h3>
        <table className="invoices-table">
          <thead>
            <tr className="invoices-table-header">
              <th>Customer ID</th>
              <th>Invoice Count</th>
              <th>Total Spend</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.map((row, i) => (
              <tr key={i} className="invoices-table-row">
                <td>{row.id}</td>
                <td>{row.count}</td>
                <td>{row.amount}</td>
                <td>
                  <span className={`invoice-status ${row.status.toLowerCase()}`}>
                    {row.status}
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