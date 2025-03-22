import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import torch
import torch.nn as nn
import torch.optim as optim
import pickle
import matplotlib.pyplot as plt

###################################################
# 1) Load & Scale Data
###################################################
df = pd.read_csv("/Users/chloegray/Documents/GitHub/hackathon/models/costco_stock_data.csv")
df['Date'] = pd.to_datetime(df['Date'])
df.sort_values('Date', inplace=True)
df.reset_index(drop=True, inplace=True)

print("Missing values:\n", df.isnull().sum())

features = ['Open', 'High', 'Low', 'Close', 'Volume']
data = df[features].copy()

scaler = MinMaxScaler(feature_range=(0,1))
data_scaled = scaler.fit_transform(data)

# Save the scaler for inverse transform later
with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

print("\nData has been scaled. Scaled data shape:", data_scaled.shape)

###################################################
# 2) Create Sequences (60-day window -> next 7 days)
###################################################
def create_sequences(data, seq_length, forecast_horizon):
    X, y = [], []
    for i in range(len(data) - seq_length - forecast_horizon + 1):
        X.append(data[i : i + seq_length])
        # index 3 => 'Close'
        y.append(data[i + seq_length : i + seq_length + forecast_horizon, 3])
    return np.array(X), np.array(y)

SEQ_LENGTH = 60
FORECAST_HORIZON = 7
X_sequences, y_sequence = create_sequences(data_scaled, SEQ_LENGTH, FORECAST_HORIZON)

print("Shape of input sequences (X):", X_sequences.shape)
print("Shape of targets (y):", y_sequence.shape)

###################################################
# 3) Split into Train, Validation, Test
###################################################
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

# IMPORTANT: reshape y from (batch, 7) or (batch, 7, 1) to (batch, 7)
# If your y is (batch, 7, 1), remove the last dimension:
y_train = y_train.reshape(-1, FORECAST_HORIZON)
y_val = y_val.reshape(-1, FORECAST_HORIZON)
y_test = y_test.reshape(-1, FORECAST_HORIZON)

# Convert to tensors
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

###################################################
# 4) Define a Simple “OG” LSTM Model
###################################################
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
        # x shape: (batch, seq_length=60, input_size=5)
        out, (hn, cn) = self.lstm(x)      # out shape: (batch, seq_length, hidden_size)
        out = out[:, -1, :]              # take the last time step: (batch, hidden_size)
        out = self.fc(out)               # (batch, forecast_horizon=7)
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
optimizer = optim.Adam(model.parameters(), lr=0.001)

###################################################
# 5) Train the Model
###################################################
num_epochs = 200
best_val_loss = float('inf')

# Move data to GPU if available
X_train_tensor = X_train_tensor.to(device)
y_train_tensor = y_train_tensor.to(device)
X_val_tensor   = X_val_tensor.to(device)
y_val_tensor   = y_val_tensor.to(device)

for epoch in range(num_epochs):
    # --- Training ---
    model.train()
    optimizer.zero_grad()

    train_output = model(X_train_tensor)  # shape: (train_size, 7)
    train_loss = criterion(train_output, y_train_tensor)
    train_loss.backward()
    optimizer.step()

    # --- Validation ---
    model.eval()
    with torch.no_grad():
        val_output = model(X_val_tensor)  # shape: (val_size, 7)
        val_loss = criterion(val_output, y_val_tensor)

    # Save best model
    if val_loss.item() < best_val_loss:
        best_val_loss = val_loss.item()
        torch.save(model.state_dict(), 'best_lstm_model.pth')

    print(f"Epoch {epoch+1}/{num_epochs} | Train Loss: {train_loss.item():.4f} | Val Loss: {val_loss.item():.4f}")

###################################################
# 6) Evaluate on Test Set
###################################################
model.load_state_dict(torch.load('best_lstm_model.pth'))
model.eval()

X_test_tensor = X_test_tensor.to(device)
y_test_tensor = y_test_tensor.to(device)

with torch.no_grad():
    test_pred = model(X_test_tensor)  # shape: (test_size, 7)
    test_loss = criterion(test_pred, y_test_tensor)

print(f"Test Loss: {test_loss.item():.4f}")

###################################################
# 7) Inverse Transform & Plot
###################################################
# We only scaled 'Close' in column index 3 from data_min_[3] to data_max_[3]
close_min = scaler.data_min_[3]
close_max = scaler.data_max_[3]

test_pred_np = test_pred.cpu().numpy()  # (test_size, 7)
y_test_np = y_test_tensor.cpu().numpy()  # (test_size, 7)

# Reverse scale each predicted close price
test_pred_inv = test_pred_np * (close_max - close_min) + close_min
y_test_inv = y_test_np * (close_max - close_min) + close_min

# Let's plot one sample from the test set
sample_idx = 0
plt.figure(figsize=(10, 5))
plt.plot(y_test_inv[sample_idx, :], label='Actual Closing Price')
plt.plot(test_pred_inv[sample_idx, :], label='Predicted Closing Price')
plt.xlabel("Forecasted Day")
plt.ylabel("Stock Price")
plt.title(f"Actual vs. Predicted Closing Prices (Test Sample {sample_idx})")
plt.legend()
plt.tight_layout()
plt.show()