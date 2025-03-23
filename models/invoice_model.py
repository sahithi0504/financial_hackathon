import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns

# shared model training function
def _train_and_predict():
    df = pd.read_csv("models/aggregated_invoice_data.csv")

    features = [
        "invoice_count",
        "avg_quantity",
        "avg_unit_price",
        "avg_invoice_amount",
        "max_invoice_amount"
    ]
    X = df[features]
    y = df["risk_flag"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    df["predicted_risk"] = model.predict(X)
    return df


def generate_risk_distribution_plot():
    df = _train_and_predict()
    risk_counts = df["predicted_risk"].value_counts()
    labels = ["Not Risky", "Risky"]
    colors = ["#66b3ff", "#ff6666"]

    fig, ax = plt.subplots(figsize=(6, 6))
    ax.pie(risk_counts, labels=labels, autopct='%1.1f%%', colors=colors, startangle=140)
    ax.set_title("Customer Risk Distribution")
    fig.tight_layout()

    return fig


def generate_top_risky_customers_plot():
    df = _train_and_predict()
    top_risky = df[df["predicted_risk"] == 1].nlargest(10, "avg_invoice_amount")

    fig, ax = plt.subplots(figsize=(10, 6))
    sns.barplot(data=top_risky, x="avg_invoice_amount", y="customer_id", palette="rocket", ax=ax)
    ax.set_title("Top 10 Risky Customers by Avg Invoice")
    ax.set_xlabel("Avg Invoice Amount")
    ax.set_ylabel("Customer ID")
    fig.tight_layout()

    return fig


def get_risky_customers_data():
    df = _train_and_predict()
    risky_customers = df[df["predicted_risk"] == 1][
        ["customer_id", "avg_invoice_amount", "invoice_count", "max_invoice_amount"]
    ]
    return risky_customers.to_dict(orient="records")