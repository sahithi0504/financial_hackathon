import React from "react";
import "./GoalTracker.css";

const GoalTracker = () => {
  return (
    <div className="goal-tracker">
      <div className="graphs-section">
        <h2>Financial Graphs</h2>

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
