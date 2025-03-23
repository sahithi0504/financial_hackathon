from stock_price import StockForecaster
import matplotlib.pyplot as plt


if __name__ == "__main__":
    forecaster = StockForecaster()
    fig = forecaster.generate_trend_signal()
    print(fig)
  