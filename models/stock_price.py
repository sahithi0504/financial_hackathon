import pandas as pd
import numpy as np
import pickle
import matplotlib.pyplot as plt
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import MinMaxScaler

class LSTMModel(nn.Module):
    def __init__(self, input_size=5, hidden_size=128, num_layers=2, dropout=0.2, forecast_horizon=7):
        super(LSTMModel, self).__init__()
        self.lstm = nn.LSTM(
            input_size,
            hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout
        )
        self.fc = nn.Linear(hidden_size, forecast_horizon)

    def forward(self, x):
        out, _ = self.lstm(x)
        out = out[:, -1, :]
        out = self.fc(out)
        return out

class StockForecaster:
    def __init__(self, csv_path='costco_stock_data.csv'):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.SEQ_LENGTH = 60
        self.FORECAST_HORIZON = 7

        self.df = pd.read_csv(csv_path)
        self.df['Date'] = pd.to_datetime(self.df['Date'])
        self.df.sort_values('Date', inplace=True)
        self.df.reset_index(drop=True, inplace=True)

        features = ['Open', 'High', 'Low', 'Close', 'Volume']
        data = self.df[features].copy()

        self.scaler = MinMaxScaler()
        self.data_scaled = self.scaler.fit_transform(data)

        with open('scaler.pkl', 'wb') as f:
            pickle.dump(self.scaler, f)

        self.X, self.y = self.create_sequences(self.data_scaled, self.SEQ_LENGTH, self.FORECAST_HORIZON)

        self.model = LSTMModel(
            input_size=5,
            hidden_size=128,
            num_layers=2,
            dropout=0.2,
            forecast_horizon=self.FORECAST_HORIZON
        ).to(self.device)

        self.model.load_state_dict(torch.load('best_lstm_model.pth', map_location=self.device))
        self.model.eval()

    def create_sequences(self, data, seq_length, forecast_horizon):
        X, y = [], []
        for i in range(len(data) - seq_length - forecast_horizon + 1):
            X.append(data[i: i + seq_length])
            y.append(data[i + seq_length: i + seq_length + forecast_horizon, 3])
        return np.array(X), np.array(y)

    def plot_predictions(self):
        close_min = self.scaler.data_min_[3]
        close_max = self.scaler.data_max_[3]

        latest_60 = self.data_scaled[-self.SEQ_LENGTH:]
        latest_60_tensor = torch.tensor(latest_60, dtype=torch.float32).unsqueeze(0).to(self.device)

        with torch.no_grad():
            latest_pred = self.model(latest_60_tensor).cpu().numpy().flatten()

        predicted_close = latest_pred * (close_max - close_min) + close_min
        forecast_dates = pd.date_range(start=self.df['Date'].iloc[-1] + pd.Timedelta(days=1), periods=self.FORECAST_HORIZON)

        last_60_df = self.df.tail(self.SEQ_LENGTH)
        fig, ax = plt.subplots(figsize=(14, 6))

        ax.plot(last_60_df['Date'], last_60_df['Close'], label="Actual Closing Price", color='blue')
        last_price = last_60_df['Close'].values[-1]
        last_date = last_60_df['Date'].values[-1]
        ax.plot([last_date], [last_price], marker='o', color='blue')

        ax.plot(forecast_dates, predicted_close, label="Predicted Closing Price", linestyle='--', color='orange')
        ax.plot([last_date, forecast_dates[0]], [last_price, predicted_close[0]], linestyle='--', color='orange', alpha=0.6)

        ax.set_xlabel("Date")
        ax.set_ylabel("Stock Price")
        ax.set_title("Actual vs Predicted Closing Prices")
        ax.legend()
        fig.tight_layout()

        return fig
    
    def generate_trend_signal(self):
        """
        Analyzes the 7-day forecast and returns a trend signal
        Positive Trend, Negative Trend, Stable
        """

        close_min = self.scaler.data_min_[3]
        close_max = self.scaler.data_max_[3]

        latest_60 = self.data_scaled[-self.SEQ_LENGTH:]
        latest_60_tensor = torch.tensor(latest_60, dtype=torch.float32).unsqueeze(0).to(self.device)

        with torch.no_grad():
            latest_pred = self.model(latest_60_tensor).cpu().numpy().flatten()

        predicted_close = latest_pred * (close_max - close_min) + close_min

        # Calculate average predicted price and compare to the last actual close
        last_actual_close = self.df['Close'].iloc[-1]
        avg_predicted_close = predicted_close.mean()
        change_percent = ((avg_predicted_close - last_actual_close) / last_actual_close) * 100

        # Assign friendly trend label
        if change_percent > 1:
            trend = "Positive Trend"
        elif change_percent < -1:
            trend = "Negative Trend"
        else:
            trend = "Stable"

        return {
            "trend": trend,
            "change_percent": round(change_percent, 2),
            "avg_predicted_close": round(avg_predicted_close, 2),
            "last_actual_close": round(last_actual_close, 2)
        }

        #"The 7-day forecast indicates a stable trend, with an average projected closing price of $905.42, representing a slight decrease of 0.42% from the most recent close of $909.26."
            




    

    
    
        

   

