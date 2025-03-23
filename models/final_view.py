from fastapi import FastAPI, Response
import io
import base64
from views import revenue_forecast
from views import gross_profit_forecast
from views import operating_expenses_forecast
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

    

