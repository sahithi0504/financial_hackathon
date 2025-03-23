import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid'; // Added import for MUI DataGrid
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
      <div className="graphs">
        <div className="graph">
          <h3>Stock Trend Forecast</h3>
          <img 
            src="http://localhost:8000/stock_trend_graph" 
            alt="Stock Trend Forecast" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
        </div>
        <div className="graph">
          <h3>Risk Pie Chart</h3>
          <img 
            src="http://localhost:8000/risk_pie_chart" 
            alt="Risk Pie Chart" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
        </div>
        <div className="graph">
          <h3>Financial Standing</h3>
          <img 
            src="http://localhost:8000/financial_standing" 
            alt="Financial Standing" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
        </div>
        <div className="graph">
          <h3>Risky Customers Data</h3>
          {riskyCustomers ? (
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={riskyCustomers.map((row, index) => ({ id: row.id || index, ...row }))}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </div>
          ) : (
            <p>Loading risky customers data...</p>
          )}
        </div>
        <div className="graph">
          <h3>Gross Profit Forecast</h3>
          <img 
            src="http://localhost:8000/gross_profit_forecast" 
            alt="Gross Profit Forecast" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
        </div>
      </div>
    </div>
  );
}

export default ModelInsights;
