import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaMoneyBill,
} from "react-icons/fa";
import "./GoalTracker.css";

const GoalTracker = () => {
  const [goals, setGoals] = useState([
   
    
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    icon: "revenue",
    title: "",
    target: "",
    actual: "",
    timeframe: new Date(),
  });

  

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setNewGoal({
      icon: "revenue",
      title: "",
      target: "",
      actual: "",
      timeframe: new Date(),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setNewGoal((prev) => ({ ...prev, timeframe: date }));
  };

  const addGoal = () => {
    const id = Date.now();
    const icon = iconOptions[newGoal.icon] || <FaMoneyBill />;
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
              style={{ width: `${pct}%`,
              backgroundColor: getProgressColor(pct), }}
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
                <option value="revenue">Revenue</option>
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
      <div className="graphs-section">
        {/* Card 1: Monthly Invoices < $30k */}
        <div className="graph-card">
          <div className="card-header">
            <h3>Goal: Monthly Invoices &lt; $30k</h3>
          </div>
          <div className="card-body">
            <img
              src="http://localhost:8000/top_risky_bar_chart"
              alt="Top Risky Bar Chart"
            />
          </div>
          <div className="card-footer">
            <p className="footer-warning">Risky Invoice not being met the targeted goal</p>
            <div className="footer-extra">
              <div className="footer-timeframe">Timeframe: March 2025</div>
              <div className="footer-progress-bar">
                <div
                  className="footer-progress-fill"
                  style={{ width: "20%", backgroundColor: "#FFCE1B" }}
                ></div>
              </div>
              <p className="footer-progress-percentage">20% achieved</p>
            </div>
          </div>
        </div>

        {/* Card 2: Net Income Forecast */}
        <div className="graph-card">
          <div className="card-header">
            <h3>Goal: Net Income increase by 5%</h3>
          </div>
          <div className="card-body">
            <img
              src="http://localhost:8000/net_income_forecast"
              alt="Net Income Forecast"
            />
          </div>
          <div className="card-footer">
            <p className="footer-good" >Net income is predicted to increase over the next two quarters! </p>
            <div className="footer-extra">
              <div className="footer-timeframe">Timeframe: Q1 2025</div>
              <div className="footer-progress-bar">
                <div
                  className="footer-progress-fill"
                  style={{ width: "60%", backgroundColor: "#FFCE1B" }}
                ></div>
              </div>
              <p className="footer-progress-percentage">60% achieved</p>
            </div>
          </div>
        </div>

        {/* Card 3: Operating Expenses Forecast */}
        <div className="graph-card">
          <div className="card-header">
            <h3>Goal: Operating Expenses Decrease by 10%</h3>
          </div>
          <div className="card-body">
            <img
              src="http://localhost:8000/operating_expenses_forecast"
              alt="Operating Expenses Forecast"
            />
          </div>
          <div className="card-footer">
            <p className="footer-warning">Operating Expenses are predicted to increase over the next two quarters, following the past trends.</p>
            <div className="footer-extra">
              <div className="footer-timeframe">Timeframe: Q2 2025</div>
              <div className="footer-progress-bar">
                <div
                  className="footer-progress-fill"
                  style={{ width: "5%", backgroundColor: "#FFCE1B" }}
                ></div>
              </div>
              <p className="footer-progress-percentage">5% achieved</p>
            </div>
          </div>
        </div>

        {/* Card 4: Revenue Forecast */}
        <div className="graph-card">
          <div className="card-header">
            <h3>Goal: Revenue Forecast increase by 5%</h3>
          </div>
          <div className="card-body">
            <img
              src="http://localhost:8000/revenue_forecast"
              alt="Revenue Forecast"
            />
          </div>
          <div className="card-footer">
            <p className="footer-good">Revenue is predicted to increase by 2%, following the past trends</p>
            <div className="footer-extra">
              <div className="footer-timeframe">Timeframe: Q3 2025</div>
              <div className="footer-progress-bar">
                <div
                  className="footer-progress-fill"
                  style={{ width: "25%", backgroundColor: "#FFCE1B" }}
                ></div>
              </div>
              <p className="footer-progress-percentage">25% achieved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;
