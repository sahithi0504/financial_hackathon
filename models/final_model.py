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
    df = pd.read_csv("/Users/chloegray/Documents/GitHub/financial_hackathon/models/costco_profit.csv")
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

def get_label(row):
    if row["risky_percent"] >= 0.5 and row["net_income_growth"] < 0 and row["trend_signal"] == -1:
        return "At Risk"
    elif row["risky_percent"] <= 0.2 and row["net_income_growth"] > 5 and row["trend_signal"] == 1:
        return "Healthy"
    else:
        return "Watch"

def collect_and_store_snapshot(output_csv="financial_snapshots.csv"):
    try:
        # Extract values from models
        risky_percent = round(get_risky_percent(), 4)
        net_income_growth = round(get_net_income_growth(), 2)
        trend_label, trend_signal = get_trend_signal()

        snapshot = {
            "risky_percent": risky_percent,
            "net_income_growth": net_income_growth,
            "trend_signal": trend_signal,
            "trend_label": trend_label
        }

        snapshot["label"] = get_label(snapshot)
        print(f"Final Label: {snapshot['label']}")

        # Save snapshot to CSV
        df_row = pd.DataFrame([snapshot])
        if os.path.exists(output_csv):
            df_existing = pd.read_csv(output_csv)
            df_combined = pd.concat([df_existing, df_row], ignore_index=True)
        else:
            df_combined = df_row

        df_combined.to_csv(output_csv, index=False)
        print("\n Snapshot added to CSV:")
        print(df_row)

    except Exception as e:
        print(f" Failed to collect snapshot: {e}")

# Run the collector
if __name__ == "__main__":
    collect_and_store_snapshot()