import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import torch
import torch.nn as nn
import torch.optim as optim
import pickle
import matplotlib.pyplot as plt

# Load and preprocess data
df = pd.read_csv("costco_stock_data.csv")
df['Date'] = pd.to_datetime(df['Date'])
df.sort_values('Date', inplace=True)
df.reset_index(drop=True, inplace=True)

features = ['Open', 'High', 'Low', 'Close', 'Volume']
data = df[features].copy()
scaler = MinMaxScaler()
data_scaled = scaler.fit_transform(data)

# Save the scaler
with open('vol_scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

def create_volatility_sequences(data, seq_length, forecast_horizon):
    X, y = [], []
    close_prices = data[:, 3] 
    




