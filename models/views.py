from profit_loss import generate_forecast_plot

feature_colors = {
    "Revenue": "blue",
    "Gross Profit": "green",
    "Operating Expenses": "purple",
    "Net Income": "orange",
    "Financial Standing": "darkred"
}


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

if __name__ == '__main__':
    financial_standing()