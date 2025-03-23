import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import './ModelInsights.css';

function ModelInsights() {
  const [riskyCustomers, setRiskyCustomers] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/risky_customers_json")
      .then((res) => res.json())
      .then((data) => setRiskyCustomers(data))
      .catch((err) => console.error("Error fetching risky customers data:", err));
  }, []);

  // Dynamically create columns based on keys from the first record (if available)
  const columns =
    riskyCustomers && riskyCustomers.length > 0
      ? Object.keys(riskyCustomers[0]).map((key) => ({
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          width: 150,
        }))
      : [];

  return (
    <div className="model-insights-container">
      <h2>Model Insights</h2>

      <div className="cards-container">

        {/* Card 1: Stock Trend Forecast */}
        <div className="insight-card">
          <div className="card-header">
            <h3>Stock Trend Forecast</h3>
          </div>
          <div className="card-body">
            <img
              src="http://localhost:8000/stock_trend_graph"
              alt="Stock Trend Forecast"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <div className="card-footer">
            <p className="semantic-analysis">
              The 7-day forecast indicates a stable trend, with an average projected closing price 
              of $905.42, representing a slight decrease of 0.42% from the most recent close of $909.26.
            </p>
          </div>
        </div>

        {/* Card 2: Risk Pie Chart */}
        <div className="insight-card">
          <div className="card-header">
            <h3>Risk Pie Chart</h3>
          </div>
          <div className="card-body">
            <img
              src="http://localhost:8000/risk_pie_chart"
              alt="Risk Pie Chart"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <div className="card-footer">
            <p className="semantic-analysis">
              The distribution of risk categories remains consistent with prior periods, 
              suggesting stable risk management strategies.
            </p>
          </div>
        </div>

        {/* Card 3: Financial Standing */}
        <div className="insight-card">
          <div className="card-header">
            <h3>Financial Standing</h3>
          </div>
          <div className="card-body">
            <img
              src="http://localhost:8000/financial_standing"
              alt="Financial Standing"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <div className="card-footer">
            <p className="semantic-analysis">
              Company maintains a strong liquidity position with a stable capital structure, 
              forecasting minor fluctuations in the short term.
            </p>
          </div>
        </div>

        {/* Card 4: Risky Customers Data */}
        <div className="insight-card">
          <div className="card-header">
            <h3>Risky Customers Data</h3>
          </div>
          <div className="card-body">
            {riskyCustomers ? (
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={riskyCustomers.map((row, index) => ({
                    id: row.id || index, 
                    ...row 
                  }))}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />
              </div>
            ) : (
              <p>Loading risky customers data...</p>
            )}
          </div>
          <div className="card-footer">
            <p className="semantic-analysis">
              The above table highlights high-risk customers who may require additional 
              scrutiny or follow-up to mitigate potential losses.
            </p>
          </div>
        </div>

        {/* Card 5: Gross Profit Forecast */}
        <div className="insight-card">
          <div className="card-header">
            <h3>Gross Profit Forecast</h3>
          </div>
          <div className="card-body">
            <img
              src="http://localhost:8000/gross_profit_forecast"
              alt="Gross Profit Forecast"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <div className="card-footer">
            <p className="semantic-analysis">
              Projected gross profits are expected to rise by 5% over the next quarter, 
              aligning with stable demand and efficient cost management.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ModelInsights;
