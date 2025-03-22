import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import pmdarima as pm
from statsmodels.tsa.arima.model import ARIMA
import warnings

# suppress warnings
warnings.filterwarnings("ignore", category=FutureWarning)

# load the dataset
df = pd.read_csv("/Users/chloegray/Documents/GitHub/financial_hackathon/models/costco_profit.csv")
df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%y')
df.set_index('Date', inplace=True)

# remove commas and convert to numeric
for col in df.columns:
    df[col] = df[col].astype(str).str.replace(',', '')
    df[col] = pd.to_numeric(df[col])

# sort by date
df.sort_index(inplace=True)
df.index = pd.date_range(start=df.index[0], periods=len(df), freq='Q')

def forecast_and_plot(series, label, color):
    print(f"\n=== {label.upper()} FORECAST ===")
    
    # Auto ARIMA to find best parameters
    auto_model = pm.auto_arima(
        series,
        seasonal=True,
        m=3,  
        trace=True,
        error_action='ignore',
        suppress_warnings=True
    )

    print("Best ARIMA order found:", auto_model.order, "Seasonal order:", auto_model.seasonal_order)

    # Fit ARIMA model
    model = ARIMA(series, order=auto_model.order, seasonal_order=auto_model.seasonal_order)
    model_fit = model.fit()

    # Forecast next 2 quarters
    forecast = model_fit.forecast(steps=2)
    last_date = series.index[-1]
    forecast_dates = [last_date + pd.DateOffset(months=3*(i+1)) for i in range(2)]

    print("\nForecasted values:")
    for i in range(2):
        print(f"{label} - {forecast_dates[i].strftime('%b %Y')}: {forecast.iloc[i]:,.2f}")

    # Plotting
    plt.figure(figsize=(10, 6))
    plt.plot(series.index, series.values, label=f'Historical {label}', marker='o', color=color)
    plt.plot(forecast_dates, forecast.values, label=f'Forecasted {label}', color='red', marker='o', linewidth=2)
    plt.plot(
        [series.index[-1], forecast_dates[0]],
        [series.values[-1], forecast.values[0]],
        color='red', linestyle='--', linewidth=1.5
    )
    plt.xlabel('Date')
    plt.ylabel(label)
    plt.title(f'{label} with Forecast')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(f'{label.replace(" ", "_")}_Forecast.png')
    plt.show()
    plt.close('all')

metrics = {
    'Revenue': 'blue',
    'Gross Profit': 'green',
    'Operating Expenses': 'purple',
    'Net Income': 'orange'
}

for metric, color in metrics.items():
    if metric in df.columns:
        forecast_and_plot(df[metric], metric, color)
    else:
        print(f"Column '{metric}' not found in data.")
        
#financial standing formula and output
if all(col in df.columns for col in ['Gross Profit', 'Operating Expenses', 'Net Income']):
    df['Financial Standing'] = (df['Gross Profit'] - df['Operating Expenses']) + df['Net Income']
    forecast_and_plot(df['Financial Standing'], 'Financial Standing', color='darkred')
else:
    print("One or more required columns for Financial Standing not found.")