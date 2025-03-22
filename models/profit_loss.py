import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import pmdarima as pm
from statsmodels.tsa.arima.model import ARIMA
import warnings

# p:AutoRegressive (AR)	Looks at how past values influence current ones
# d:Integrated (I)	Makes the data more stable by removing trends
# q:Moving Average (MA)	Looks at past errors and tries to correct them


warnings.filterwarnings("ignore", category=FutureWarning)
df = pd.read_csv("costco_profit.csv")
df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%y')
df.set_index('Date', inplace=True)

#removing commas
for col in df.columns:
    df[col] = df[col].astype(str).str.replace(',', '')
    df[col] = pd.to_numeric(df[col])
# for chronological order
df.sort_index(inplace=True)

#coz we are only predicting revenue
revenue = df['Revenue']

#using auto_arima to determine the best arima order p,d,q
auto_model = pm.auto_arima(revenue, seasonal=True, m=4, trace=True, error_action='ignore', suppress_warnings=True)
print("Best ARIMA order found:", auto_model.order, "Seasonal order:", auto_model.seasonal_order)

#fitting the ARIMA model using the parameters auto_arima suggested
model = ARIMA(revenue, order=auto_model.order, seasonal_order=auto_model.seasonal_order)
model_fit = model.fit()

#forecast the next 2 quarter
forecast = model_fit.forecast(steps=2)
print("Forecasted Revenues for next two quarters:")
for i in range(2):
    print(f"Quarter {i+1}: {forecast.iloc[i]:,.2f}")

#plotting
last_date = revenue.index[-1]
forecast_dates = [last_date + pd.DateOffset(months=3*(i+1)) for i in range(2)]

# Plot historical revenue
plt.figure(figsize=(10, 6))
plt.plot(revenue.index, revenue.values, label='Historical Revenue', marker='o')

# Plot forecasted revenue (as line + points)
plt.plot(forecast_dates, forecast.values, label='Forecasted Revenue', color='red', marker='o', linewidth=2)

# Labels and styling
plt.xlabel('Date')
plt.ylabel('Revenue')
plt.title('Revenue with Forecast')
plt.legend()
plt.grid(True)
plt.show()