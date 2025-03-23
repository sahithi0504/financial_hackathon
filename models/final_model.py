import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import pmdarima as pm
from statsmodels.tsa.arima.model import ARIMA
import warnings
from stock_price import StockForecaster
from invoice_model import _train_and_predict

# ----- ARIMA Financial Forecast Function -----
def compute_arima_growth(feature_name: str):
    """
    Loads the financial dataset, fits an ARIMA model to the specified feature,
    and computes the percentage growth from the last historical value to the first forecasted value.
    """
    warnings.filterwarnings("ignore", category=FutureWarning)
    
    # Load and preprocess dataset
    df = pd.read_csv("/Users/chloegray/Documents/GitHub/financial_hackathon/models/costco_profit.csv")
    df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%y')
    df.set_index('Date', inplace=True)
    
    # Clean numeric columns (remove commas and convert to numbers)
    for col in df.columns:
        df[col] = df[col].astype(str).str.replace(',', '')
        df[col] = pd.to_numeric(df[col])
    
    # Sort by date and enforce quarterly frequency
    df.sort_index(inplace=True)
    df.index = pd.date_range(start=df.index[0], periods=len(df), freq='Q')
    
    # If available, create a 'Financial Standing' column for further analysis
    if all(col in df.columns for col in ['Gross Profit', 'Operating Expenses', 'Net Income']):
        df['Financial Standing'] = (df['Gross Profit'] - df['Operating Expenses']) + df['Net Income']
    
    # Validate the feature exists in the dataset
    if feature_name not in df.columns:
        raise ValueError(f"Feature '{feature_name}' not found in dataset.")
    
    series = df[feature_name]
    
    # Fit ARIMA model using auto_arima
    auto_model = pm.auto_arima(
        series,
        seasonal=True,
        m=3,
        trace=False,
        error_action='ignore',
        suppress_warnings=True
    )
    
    # Build ARIMA model and forecast the next two periods
    model = ARIMA(series, order=auto_model.order, seasonal_order=auto_model.seasonal_order)
    model_fit = model.fit()
    forecast = model_fit.forecast(steps=2)
    
    last_value = series.values[-1]
    forecast_value = forecast.values[0]
    
    # Calculate percentage growth
    growth_percent = ((forecast_value - last_value) / last_value) * 100
    return growth_percent

# ----- LSTM Stock Forecast Function -----
def compute_lstm_stock_change():
    """
    Uses the LSTM-based stock forecaster to retrieve the forecasted stock price change percentage.
    Assumes that the StockForecaster class (with its generate_trend_signal method) is defined.
    """
    # Instantiate the forecaster with your stock CSV (adjust the path as needed)
    forecaster = StockForecaster(csv_path='/Users/chloegray/Documents/GitHub/financial_hackathon/models/costco_stock_data.csv')
    
    # generate_trend_signal() returns a dict with a key "change_percent"
    trend_signal = forecaster.generate_trend_signal()
    return trend_signal["change_percent"]

# ----- Risk Model Function -----
def compute_risk_percentage():
    """
    Uses the risk model to predict customer risk and computes the percentage of customers flagged as high risk.
    Assumes that the _train_and_predict function (which adds a "predicted_risk" column) is defined.
    """
    df = _train_and_predict()  # This function should return a DataFrame with a "predicted_risk" column
    total_customers = len(df)
    high_risk_count = (df["predicted_risk"] == 1).sum()
    risk_percentage = (high_risk_count / total_customers) * 100
    return risk_percentage

# ----- Composite Financial Health Index -----
def compute_composite_financial_health_index(feature_name: str = "Net Income"):
    """
    Computes three percentage-based metrics and combines them into a composite financial health index.
    The formula used here is:
    
        Composite Index = (ARIMA Growth % + LSTM Stock Change % - Risk Percentage) / 3
    
    You can modify the formula based on your weighting preferences.
    """
    arima_growth = compute_arima_growth(feature_name)
    lstm_stock_change = compute_lstm_stock_change()
    risk_percentage = compute_risk_percentage()
    
    composite_index = (arima_growth + lstm_stock_change - risk_percentage) / 3
    return {
        "ARIMA Growth %": arima_growth,
        "LSTM Stock Change %": lstm_stock_change,
        "Risk Percentage": risk_percentage,
        "Composite Index": composite_index
    }

# ----- Main Execution -----
if __name__ == "__main__":
    try:
        # You can choose which financial feature to use (e.g., "Net Income" or "Revenue")
        result = compute_composite_financial_health_index("Net Income")
        print("Composite Financial Health Index Results:")
        for key, value in result.items():
            print(f"{key}: {value:.2f}%")
    except Exception as e:
        print("Error:", e)