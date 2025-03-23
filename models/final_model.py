import pandas as pd
import os
from invoice_model import _train_and_predict 
from stock_price import StockForecaster  

def get_risky_percent():
    df = _train_and_predict()
    total = len(df)
    risky = (df["predicted_risk"] == 1).sum()
    risky_percent = risky / total if total > 0 else 0.0
    print(f"Risky Customers: {risky} / {total} ({risky_percent:.2%})")
    return risky_percent

def get_net_income_growth():
    df = pd.read_csv("models/costco_profit.csv")
    df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%y')
    df.sort_values('Date', inplace=True)

    df['Net Income'] = df['Net Income'].astype(str).str.replace(',', '').astype(float)
    latest = df['Net Income'].iloc[-1]
    previous = df['Net Income'].iloc[-2]
    growth = ((latest - previous) / previous) * 100
    print(f"Net Income Growth: {growth:.2f}% (Latest: {latest}, Previous: {previous})")
    return growth

def get_trend_signal():
    forecaster = StockForecaster()
    signal_info = forecaster.generate_trend_signal()
    trend = signal_info["trend"]
    signal_map = {
        "Positive Trend": 1,
        "Stable": 0,
        "Negative Trend": -1
    }
    print(f"Stock Trend Signal: {trend} ({signal_info['change_percent']}% change)")
    return trend, signal_map[trend]

if __name__ == "__main__":
    risky_percent = get_risky_percent()
    print(risky_percent)
    net_income = get_net_income_growth()
    print(net_income)
    trend_signal = get_trend_signal()
    print(trend_signal)
    