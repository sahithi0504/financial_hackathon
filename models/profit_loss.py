import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import pmdarima as pm
from statsmodels.tsa.arima.model import ARIMA
import warnings

def generate_forecast_plot(feature_name: str, feature_color: str):
    # Suppress warnings
    warnings.filterwarnings("ignore", category=FutureWarning)

    # Load and preprocess dataset
    df = pd.read_csv("costco_profit.csv")
    df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%y')
    df.set_index('Date', inplace=True)

    # Clean numeric columns
    for col in df.columns:
        df[col] = df[col].astype(str).str.replace(',', '')
        df[col] = pd.to_numeric(df[col])

    # Sort and set quarterly frequency
    df.sort_index(inplace=True)
    df.index = pd.date_range(start=df.index[0], periods=len(df), freq='Q')

    # Add 'Financial Standing' column if applicable
    if all(col in df.columns for col in ['Gross Profit', 'Operating Expenses', 'Net Income']):
        df['Financial Standing'] = (df['Gross Profit'] - df['Operating Expenses']) + df['Net Income']

    # Validate input
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

    # Fit and forecast
    model = ARIMA(series, order=auto_model.order, seasonal_order=auto_model.seasonal_order)
    model_fit = model.fit()
    forecast = model_fit.forecast(steps=2)

    last_date = series.index[-1]
    forecast_dates = [last_date + pd.DateOffset(months=3 * (i + 1)) for i in range(2)]

    # Plotting
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(series.index, series.values, label=f'Historical {feature_name}', marker='o', color=feature_color)
    ax.plot(forecast_dates, forecast.values, label=f'Forecasted {feature_name}', color='red', marker='o', linewidth=2)
    ax.plot([series.index[-1], forecast_dates[0]], [series.values[-1], forecast.values[0]],
    color='red', linestyle='--', linewidth=1.5)

    ax.set_xlabel('Date')
    ax.set_ylabel(feature_name)
    ax.set_title(f'{feature_name} Forecast')
    ax.legend()
    ax.grid(True)

    # Return the Figure object
    return fig

