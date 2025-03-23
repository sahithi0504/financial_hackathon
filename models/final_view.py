from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
from fastapi.responses import PlainTextResponse
import io
import base64
from models.views import revenue_forecast
from models.views import gross_profit_forecast
from models.views import operating_expenses_forecast
from models.views import net_income_forecast
from models.views import financial_standing
from models.views import risk_pie_chart
from models.views import top_risky_bar_chart
from models.views import stock_trend_graph
from models.views import risky_customers_json
from models.views import stock_trend_signal_text
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
origins = [
    "http://localhost:5173",
    "https://financial-hackathon-8e950.firebaseapp.com",
    "http://localhost:5174/"

]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins
    allow_credentials=False,  # cannot use "*" if True is set here
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    try:
        # Get data from the function
        data = risky_customers_json()
        # Convert the data if it's a DataFrame into a list of dictionaries
        try:
            import pandas as pd
            if isinstance(data, pd.DataFrame):
                data = data.to_dict(orient='records')
        except ImportError:
            # If pandas is not available, leave data as is
            pass

        return JSONResponse(content=data)
    except Exception as e:
        # Log the error as needed
        return JSONResponse(content={"error": str(e)}, status_code=500)
    

@app.get("/stock_trend_signal_text")
def get_stock_trend_signal_text():
    signal = stock_trend_signal_text()
    return PlainTextResponse(content=str(signal))