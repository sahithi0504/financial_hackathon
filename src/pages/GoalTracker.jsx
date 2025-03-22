import React, { useState } from 'react';
import "./GoalTracker.css";

const GoalsTracker = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Maintain monthly revenue > $10K",
      target: 10000,
      actual: 9300,
      metric: "Revenue",
      comparison: ">",
      timeframe: "March 2025",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Increase profit > $5000",
      target: 5000,
      actual: 6000,
      metric: "Profit",
      comparison: ">",
      timeframe: "Q1 2025",
      status: "Met"
    },
    {
      id: 3,
      title: "Reduce expenses < $2000",
      target: 2000,
      actual: 2500,
      metric: "Expenses",
      comparison: "<",
      timeframe: "March 2025",
      status: "Missed"
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    metric: "Revenue",
    comparison: ">",
    timeframe: ""
  });
  const [filter, setFilter] = useState("All");

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setNewGoal({
      title: "",
      target: "",
      metric: "Revenue",
      comparison: ">",
      timeframe: ""
    });
  };

  const handleNewGoalChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });
  };

  const addGoal = () => {
    const id = goals.length ? goals[goals.length - 1].id + 1 : 1;
    // For new goals, actual value is set to 0.
    const targetValue = parseFloat(newGoal.target);
    let status = "In Progress";
    const actualValue = 0;
    if (newGoal.comparison === ">" && actualValue >= targetValue) {
      status = "Met";
    } else if (newGoal.comparison === "<" && actualValue <= targetValue) {
      status = "Met";
    } else if (newGoal.comparison === "=" && actualValue === targetValue) {
      status = "Met";
    }

    const goal = {
      id,
      title: newGoal.title,
      target: targetValue,
      actual: actualValue,
      metric: newGoal.metric,
      comparison: newGoal.comparison,
      timeframe: newGoal.timeframe,
      status,
    };

    setGoals([...goals, goal]);
    closeModal();
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const calculateProgress = (goal) => {
    let progress = (goal.actual / goal.target) * 100;
    if (progress > 100) progress = 100;
    return progress.toFixed(0);
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === "All") return true;
    return goal.status === filter;
  });

  const countGoalsByStatus = (status) => {
    return goals.filter(goal => goal.status === status).length;
  };

  return (
    <div className="goals-tracker">
      <header className="header">
        <h1>Goals Tracker</h1>
        <div className="header-actions">
          <button className="add-goal-button" onClick={openModal}>+ Add New Goal</button>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Goals</option>
            <option value="Met">Met</option>
            <option value="In Progress">In Progress</option>
            <option value="Missed">Missed</option>
          </select>
        </div>
      </header>

      <section className="summary">
        <div>Total Goals: {goals.length}</div>
        <div>Met: {countGoalsByStatus("Met")} ✅</div>
        <div>In Progress: {countGoalsByStatus("In Progress")} 🟡</div>
        <div>Missed: {countGoalsByStatus("Missed")} ❌</div>
      </section>

      <section className="goals-list">
        {filteredGoals.map(goal => (
          <div key={goal.id} className={`goal-card ${goal.status.toLowerCase().replace(" ", "-")}`}>
            <h3>{goal.title}</h3>
            <p>Target: ${goal.target}</p>
            <p>Actual: ${goal.actual}</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${calculateProgress(goal)}%` }}></div>
            </div>
            <p>Status: {goal.status}</p>
            <p>Timeframe: {goal.timeframe}</p>
            <div className="goal-actions">
              <button className="edit-button">✏️</button>
              <button className="delete-button" onClick={() => deleteGoal(goal.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </section>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Goal</h2>
            <div className="form-group">
              <label>Goal Name</label>
              <input
                type="text"
                name="title"
                value={newGoal.title}
                onChange={handleNewGoalChange}
              />
            </div>
            <div className="form-group">
              <label>Target Amount</label>
              <input
                type="number"
                name="target"
                value={newGoal.target}
                onChange={handleNewGoalChange}
              />
            </div>
            <div className="form-group">
              <label>Metric Type</label>
              <select name="metric" value={newGoal.metric} onChange={handleNewGoalChange}>
                <option value="Revenue">Revenue</option>
                <option value="Profit">Profit</option>
                <option value="Invoices">Invoices</option>
              </select>
            </div>
            <div className="form-group">
              <label>Comparison Type</label>
              <select name="comparison" value={newGoal.comparison} onChange={handleNewGoalChange}>
                <option value=">">{'>'}</option>
                <option value="<">{'<'}</option>
                <option value="=">{'='}</option>
              </select>
            </div>
            <div className="form-group">
              <label>Target Time Period</label>
              <input
                type="text"
                name="timeframe"
                placeholder="e.g., March 2025"
                value={newGoal.timeframe}
                onChange={handleNewGoalChange}
              />
            </div>
            <div className="modal-actions">
              <button className="save-button" onClick={addGoal}>✅ Save</button>
              <button className="cancel-button" onClick={closeModal}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsTracker;
