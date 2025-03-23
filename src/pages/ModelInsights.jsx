import React from 'react';
import './ModelInsights.css'; 

function ModelInsights() {
  return (
    <div className="model-insights-container">
      <h2>Financial Model Insights</h2>
      <div className="graphs">
        <div className="graph">
          <h3>Revenue Forecast</h3>
          <img 
            src="http://localhost:8000/revenue_forecast" 
            alt="Revenue Forecast" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
        </div>
        <div className="graph">
          <h3>Gross Profit Forecast</h3>
          <img 
            src="http://localhost:8000/gross_profit_forecast" 
            alt="Gross Profit Forecast" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
        </div>
        <div className="graph">
          <h3>Operating Expenses Forecast</h3>
          <img 
            src="http://localhost:8000/operating_expenses_forecast" 
            alt="Operating Expenses Forecast" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
        </div>
        <div className="graph">
          <h3>Net Income Forecast</h3>
          <img 
            src="http://localhost:8000/net_income_forecast" 
            alt="Net Income Forecast" 
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
          <h3>Risk Pie Chart</h3>
          <img 
            src="http://localhost:8000/risk_pie_chart" 
            alt="Risk Pie Chart" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
        </div>
        <div className="graph">
          <h3>Top Risky Bar Chart</h3>
          <img 
            src="http://localhost:8000/top_risky_bar_chart" 
            alt="Top Risky Bar Chart" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
        </div>
        <div className="graph">
          <h3>Stock Trend Graph</h3>
          <img 
            src="http://localhost:8000/stock_trend_graph" 
            alt="Stock Trend Graph" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
        </div>
      </div>
    </div>
  );
}

export default ModelInsights;
