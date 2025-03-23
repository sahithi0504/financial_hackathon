from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
from fastapi.responses import PlainTextResponse
import io
import base64
from views import revenue_forecast
from views import gross_profit_forecast
from views import operating_expenses_forecast
from views import net_income_forecast
from views import financial_standing
from views import risk_pie_chart
from views import top_risky_bar_chart
from views import stock_trend_graph
from views import risky_customers_json
from views import stock_trend_signal_text
import matplotlib.pyplot as plt


app = FastAPI()

@app.get("/revenue_forecast")
def get_revenue_forecast():
    fig = revenue_forecast()  # This is your matplotlib figure

    # Convert the figure to PNG
    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)

    # Return the PNG as bytes
    return Response(content=buf.getvalue(), media_type="image/png")

@app.get("/gross_profit_forecast")
def get_gross_profit_forecast():
    fig = gross_profit_forecast()  

    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)

    return Response(content=buf.getvalue(), media_type="image/png")

@app.get("/operating_expenses_forecast")
def get_operating_expenses_forecast():
    fig = operating_expenses_forecast()  

    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)

    return Response(content=buf.getvalue(), media_type="image/png")

@app.get("/net_income_forecast")
def get_net_income_forecast():
    fig = net_income_forecast()  

    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)

    return Response(content=buf.getvalue(), media_type="image/png")

@app.get("/financial_standing")
def get_financial_standing():
    fig = financial_standing()  

    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)

    return Response(content=buf.getvalue(), media_type="image/png")

@app.get("/risk_pie_chart")
def get_risk_pie_chart():
    fig = risk_pie_chart()  

    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)

    return Response(content=buf.getvalue(), media_type="image/png")

@app.get("/top_risky_bar_chart")
def get_top_risky_bar_chart():
    fig = top_risky_bar_chart()  

    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)

    return Response(content=buf.getvalue(), media_type="image/png")

@app.get("/stock_trend_graph")
def get_stock_trend_graph():
    fig = stock_trend_graph()  

    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)

    return Response(content=buf.getvalue(), media_type="image/png")

@app.get("/risky_customers_json")
def get_risky_customers_json():
    data = risky_customers_json()
    return JSONResponse(content=data)

@app.get("/stock_trend_signal_text")
def get_stock_trend_signal_text():
    signal = stock_trend_signal_text()
    return PlainTextResponse(content=str(signal))