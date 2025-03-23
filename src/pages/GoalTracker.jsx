import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaMoneyBill,
  FaChartLine,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import "./GoalTracker.css";

const GoalTracker = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      icon: <FaMoneyBill />,
      title: "Maintain monthly revenue > $10K",
      target: 10000,
      actual: 9300,
      timeframe: "March 2025",
    },
    {
      id: 2,
      icon: <FaFileInvoiceDollar />,
      title: "Analyze invoices for unpaid bills",
      target: 100,
      actual: 85,
      timeframe: "March 2025",
    },
    {
      id: 3,
      icon: <FaChartLine />,
      title: "Track profit margin improvements",
      target: 5000,
      actual: 6000,
      timeframe: "Q1 2025",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    icon: "revenue",
    title: "",
    target: "",
    actual: "",
    timeframe: new Date(), // Initialize with current date
  });

  const iconOptions = {
    revenue: <FaMoneyBill />,
    invoices: <FaFileInvoiceDollar />,
    profit: <FaChartLine />,
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setNewGoal({ icon: "revenue", title: "", target: "", actual: "", timeframe: new Date() });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prev) => ({ ...prev, [name]: value }));
  };

  // New handler for date selection
  const handleDateChange = (date) => {
    setNewGoal((prev) => ({ ...prev, timeframe: date }));
  };

  const addGoal = () => {
    const id = Date.now();
    const icon = iconOptions[newGoal.icon] || <FaMoneyBill />;
    // Convert the date object to a locale string for display
    const formattedDate =
      newGoal.timeframe instanceof Date
        ? newGoal.timeframe.toLocaleDateString()
        : newGoal.timeframe;
    setGoals([
      ...goals,
      {
        ...newGoal,
        id,
        icon,
        target: +newGoal.target,
        actual: +newGoal.actual,
        timeframe: formattedDate,
      },
    ]);
    closeModal();
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const calculateProgress = (goal) => {
    const pct = Math.min((goal.actual / goal.target) * 100, 100);
    return Math.floor(pct);
  };

  const getProgressColor = (pct) => {
    if (pct < 40) return "red";
    if (pct < 70) return "orange";
    return "green";
  };

  return (
    <div className="goal-tracker">
      <div className="header">
        <h2>Goal Tracker</h2>
        <button className="add-btn" onClick={openModal}>
          <FaPlus /> Add Goal
        </button>
      </div>

      <div className="goal-grid">
        {goals.map((goal) => {
          const pct = calculateProgress(goal);
          return (
            <div className="goal-card" key={goal.id}>
              <div className="goal-header">
                <span className="goal-icon">{goal.icon}</span>
                <h4>{goal.title}</h4>
              </div>
              <p className="goal-meta">Target: ${goal.target}</p>
              <p className="goal-meta">Actual: ${goal.actual}</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: getProgressColor(pct),
                  }}
                ></div>
              </div>
              <p className="goal-percentage">{pct}% achieved</p>
              <p className="goal-timeframe">Timeframe: {goal.timeframe}</p>
              <div className="goal-actions">
                <button className="edit-btn">
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => deleteGoal(goal.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>New Goal</h3>
            <div className="form-group">
              <label>Icon Type</label>
              <select name="icon" value={newGoal.icon} onChange={handleChange}>
                <option value="revenue">Stock</option>
                <option value="invoices">Invoices</option>
                <option value="profit">Profit</option>
              </select>
            </div>
            <div className="form-group">
              <label>Goal Title</label>
              <input
                type="text"
                name="title"
                value={newGoal.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Target Amount</label>
              <input
                type="number"
                name="target"
                value={newGoal.target}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Current Actual</label>
              <input
                type="number"
                name="actual"
                value={newGoal.actual}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Timeframe</label>
              <DatePicker
                selected={newGoal.timeframe}
                onChange={handleDateChange}
                dateFormat="MMMM d, yyyy"
              />
            </div>
            <div className="modal-actions">
              <button className="save-btn" onClick={addGoal}>
                Save
              </button>
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;
