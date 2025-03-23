from stock_price import StockForecaster



if __name__ == "__main__":
    forecaster = StockForecaster()
    fig = forecaster.generate_trend_signal()
    print(fig)
  