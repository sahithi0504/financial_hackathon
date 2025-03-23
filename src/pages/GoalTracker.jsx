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
                  style={{ width: "70%", backgroundColor: "green" }}
                ></div>
              </div>
              <p className="footer-progress-percentage">70% achieved</p>
            </div>
          </div>
        </div>

        {/* Card 2: Net Income Forecast */}
        <div className="graph-card">
          <div className="card-header">
            <h3>Goal: Net Income Forecast</h3>
          </div>
          <div className="card-body">
            <img
              src="http://localhost:8000/net_income_forecast"
              alt="Net Income Forecast"
            />
          </div>
          <div className="card-footer">
            <p className="footer-warning">Net income is behind target</p>
            <div className="footer-extra">
              <div className="footer-timeframe">Timeframe: Q1 2025</div>
              <div className="footer-progress-bar">
                <div
                  className="footer-progress-fill"
                  style={{ width: "80%", backgroundColor: "green" }}
                ></div>
              </div>
              <p className="footer-progress-percentage">80% achieved</p>
            </div>
          </div>
        </div>

        {/* Card 3: Operating Expenses Forecast */}
        <div className="graph-card">
          <div className="card-header">
            <h3>Goal: Operating Expenses Forecast</h3>
          </div>
          <div className="card-body">
            <img
              src="http://localhost:8000/operating_expenses_forecast"
              alt="Operating Expenses Forecast"
            />
          </div>
          <div className="card-footer">
            <p className="footer-warning">Expenses still high vs. target</p>
            <div className="footer-extra">
              <div className="footer-timeframe">Timeframe: Q2 2025</div>
              <div className="footer-progress-bar">
                <div
                  className="footer-progress-fill"
                  style={{ width: "65%", backgroundColor: "green" }}
                ></div>
              </div>
              <p className="footer-progress-percentage">65% achieved</p>
            </div>
          </div>
        </div>

        {/* Card 4: Revenue Forecast */}
        <div className="graph-card">
          <div className="card-header">
            <h3>Goal: Revenue Forecast</h3>
          </div>
          <div className="card-body">
            <img
              src="http://localhost:8000/revenue_forecast"
              alt="Revenue Forecast"
            />
          </div>
          <div className="card-footer">
            <p className="footer-warning">Revenue is on track</p>
            <div className="footer-extra">
              <div className="footer-timeframe">Timeframe: Q3 2025</div>
              <div className="footer-progress-bar">
                <div
                  className="footer-progress-fill"
                  style={{ width: "75%", backgroundColor: "green" }}
                ></div>
              </div>
              <p className="footer-progress-percentage">75% achieved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;
