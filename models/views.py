from profit_loss import generate_forecast_plot
from invoice_model import (
    generate_risk_distribution_plot,
    generate_top_risky_customers_plot,
    get_risky_customers_data
)
import matplotlib.pyplot as plt
from stock_price import StockForecaster
from fastapi import FastAPI, Response
import io
import base64


#graph
def revenue_forecast():
    plot = generate_forecast_plot('Revenue', 'blue')
    return plot

#graph
def gross_profit_forecast():
    plot = generate_forecast_plot('Gross Profit', 'green')
    return plot

#graph
def operating_expenses_forecast():
    plot = generate_forecast_plot('Operating Expenses', 'purple')
    return plot  

#graph
def net_income_forecast():
    plot = generate_forecast_plot('Net Income', 'orange')
    return plot  
#graph
def financial_standing():
    plot = generate_forecast_plot('Financial Standing', 'darkred')
    return plot 
#pie chart
def risk_pie_chart():
    plot = generate_risk_distribution_plot()
    return plot
#bar chart
def top_risky_bar_chart():
    plot = generate_top_risky_customers_plot()
    return plot
#json
def risky_customers_json():
    data = get_risky_customers_data()
    return data
#graph
def stock_trend_graph():
    forecaster = StockForecaster()
    fig = forecaster.plot_predictions()
    return fig

#text
#"The 7-day forecast indicates a stable trend, with an average projected closing price of $905.42, representing a slight decrease of 0.42% from the most recent close of $909.26."
def stock_trend_signal_text():
    forecaster = StockForecaster()
    signal = forecaster.generate_trend_signal()
    return signal


if __name__ == '__main__':
    print('haha')

