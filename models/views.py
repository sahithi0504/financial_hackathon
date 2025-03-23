from profit_loss import generate_forecast_plot
from invoice_model import (
    generate_risk_distribution_plot,
    generate_top_risky_customers_plot,
    get_risky_customers_data
)
import matplotlib.pyplot as plt
from stock_price import StockForecaster


def revenue_forecast():
    plot = generate_forecast_plot('Revenue', 'blue')
    return plot

def gross_profit_forecast():
    plot = generate_forecast_plot('Gross Profit', 'green')
    return plot
  
def operating_expenses_forecast():
    plot = generate_forecast_plot('Operating Expenses', 'purple')
    return plot  

def net_income_forecast():
    plot = generate_forecast_plot('Net Income', 'orange')
    return plot  

def financial_standing():
    plot = generate_forecast_plot('Financial Standing', 'darkred')
    return plot 

def risk_pie_chart():
    plot = generate_risk_distribution_plot()
    return plot

def top_risky_bar_chart():
    plot = generate_top_risky_customers_plot()
    return plot

def risky_customers_json():
    data = get_risky_customers_data()
    return data

def stock_trend_graph():
    forecaster = StockForecaster()
    fig = forecaster.plot_predictions()
    return fig


#"The 7-day forecast indicates a stable trend, with an average projected closing price of $905.42, representing a slight decrease of 0.42% from the most recent close of $909.26."
def stock_trend_signal_text():
    forecaster = StockForecaster()
    signal = forecaster.generate_trend_signal()
    return signal





