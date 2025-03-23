import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import torch
import torch.nn as nn
import torch.optim as optim
import pickle
import matplotlib.pyplot as plt


# load & scale data
df = pd.read_csv("costco_stock_data.csv")
df['Date'] = pd.to_datetime(df['Date'])
df.sort_values('Date', inplace=True)
df.reset_index(drop=True, inplace=True)
data_unscaled = df.copy()

print("Missing values:\n", df.isnull().sum())

features = ['Open', 'High', 'Low', 'Close', 'Volume']
data = df[features].copy()

scaler = MinMaxScaler(feature_range=(0,1))
data_scaled = scaler.fit_transform(data)

#save the scaler for inverse transform later
with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

print("\nData has been scaled. Scaled data shape:", data_scaled.shape)


# create sequences (60-day window -> next 7 days)
def create_sequences(data, seq_length, forecast_horizon):
    X, y = [], []
    for i in range(len(data) - seq_length - forecast_horizon + 1):
        X.append(data[i : i + seq_length])
        y.append(data[i + seq_length : i + seq_length + forecast_horizon, 3])
    return np.array(X), np.array(y)

SEQ_LENGTH = 60
FORECAST_HORIZON = 7
X_sequences, y_sequence = create_sequences(data_scaled, SEQ_LENGTH, FORECAST_HORIZON)

print("Shape of input sequences (X):", X_sequences.shape)
print("Shape of targets (y):", y_sequence.shape)

#split for validation, test, training
total_samples = len(X_sequences)
train_size = int(0.7 * total_samples)
val_size = int(0.15 * total_samples)
test_size = total_samples - train_size - val_size

X_train = X_sequences[:train_size]
y_train = y_sequence[:train_size]
X_val = X_sequences[train_size : train_size + val_size]
y_val = y_sequence[train_size : train_size + val_size]
X_test = X_sequences[train_size + val_size :]
y_test = y_sequence[train_size + val_size :]


y_train = y_train.reshape(-1, FORECAST_HORIZON)
y_val = y_val.reshape(-1, FORECAST_HORIZON)
y_test = y_test.reshape(-1, FORECAST_HORIZON)

# convert to tensors
X_train_tensor = torch.tensor(X_train, dtype=torch.float32)
y_train_tensor = torch.tensor(y_train, dtype=torch.float32)
X_val_tensor = torch.tensor(X_val, dtype=torch.float32)
y_val_tensor = torch.tensor(y_val, dtype=torch.float32)
X_test_tensor = torch.tensor(X_test, dtype=torch.float32)
y_test_tensor = torch.tensor(y_test, dtype=torch.float32)

print("\nPyTorch Tensor Shapes:")
print("X_train_tensor:", X_train_tensor.shape)
print("y_train_tensor:", y_train_tensor.shape)
print("X_val_tensor:", X_val_tensor.shape)
print("y_val_tensor:", y_val_tensor.shape)
print("X_test_tensor:", X_test_tensor.shape)
print("y_test_tensor:", y_test_tensor.shape)


# define a LSTM model
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
        out, (hn, cn) = self.lstm(x)    
        out = out[:, -1, :]              
        out = self.fc(out)               
        return out

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = LSTMModel(
    input_size=5,
    hidden_size=128,
    num_layers=2,
    dropout=0.2,
    forecast_horizon=FORECAST_HORIZON
).to(device)

criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=0.0005)

# training model
num_epochs = 250
best_val_loss = float('inf')

X_train_tensor = X_train_tensor.to(device)
y_train_tensor = y_train_tensor.to(device)
X_val_tensor   = X_val_tensor.to(device)
y_val_tensor   = y_val_tensor.to(device)

for epoch in range(num_epochs):
    #training
    model.train()
    optimizer.zero_grad()

    train_output = model(X_train_tensor)  
    train_loss = criterion(train_output, y_train_tensor)
    train_loss.backward()
    optimizer.step()
    #validation
    model.eval()
    with torch.no_grad():
        val_output = model(X_val_tensor) 
        val_loss = criterion(val_output, y_val_tensor)

    if val_loss.item() < best_val_loss:
        best_val_loss = val_loss.item()
        torch.save(model.state_dict(), 'best_lstm_model.pth')

    print(f"Epoch {epoch+1}/{num_epochs} | Train Loss: {train_loss.item():.4f} | Val Loss: {val_loss.item():.4f}")

# evaluate on test set
model.load_state_dict(torch.load('best_lstm_model.pth'))
model.eval()

X_test_tensor = X_test_tensor.to(device)
y_test_tensor = y_test_tensor.to(device)

with torch.no_grad():
    test_pred = model(X_test_tensor) 
    test_loss = criterion(test_pred, y_test_tensor)

print(f"Test Loss: {test_loss.item():.4f}")

# inverse transform to normalize data and plot
close_min = scaler.data_min_[3]
close_max = scaler.data_max_[3]

test_pred_np = test_pred.cpu().numpy()  
y_test_np = y_test_tensor.cpu().numpy()  

test_pred_inv = test_pred_np * (close_max - close_min) + close_min
y_test_inv = y_test_np * (close_max - close_min) + close_min

latest_60 = data_scaled[-SEQ_LENGTH:]  
latest_60_tensor = torch.tensor(latest_60, dtype=torch.float32).unsqueeze(0).to(device)  

model.eval()
with torch.no_grad():
    latest_pred = model(latest_60_tensor).cpu().numpy().flatten()  

predicted_close = latest_pred * (close_max - close_min) + close_min

forecast_dates = pd.date_range(start=df['Date'].iloc[-1] + pd.Timedelta(days=1), periods=FORECAST_HORIZON)

last_60_df = df.tail(60)
plt.figure(figsize=(14,6))

# plot last 60 days of actual closing prices
plt.plot(last_60_df['Date'], last_60_df['Close'], label="Actual Closing Price", color='blue')

# plot last actual close
last_price = last_60_df['Close'].values[-1]
last_date = last_60_df['Date'].values[-1]
plt.plot([last_date], [last_price], marker='o', color='blue')

# plot predicted future 7 days
plt.plot(forecast_dates, predicted_close, label="Predicted Closing Price", linestyle='--', color='orange')


plt.plot([last_date, forecast_dates[0]], [last_price, predicted_close[0]], linestyle='--', color='orange', alpha=0.6)
plt.xlabel("Date")
plt.ylabel("Stock Price")
plt.title("Actual vs Predicted Closing Prices")
plt.legend()
plt.tight_layout()
plt.show()
plt.close('all')