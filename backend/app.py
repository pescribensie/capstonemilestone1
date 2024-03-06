import json
import requests
import os
from flask import Flask, request, jsonify, abort
from dotenv import load_dotenv
from datetime import date, timedelta

load_dotenv()
API_KEY = os.getenv("ALPHA_VANTAGE_KEY")

app = Flask(__name__)

with open("userdb.json", 'r') as db:
    dbdict = json.load(db)

def get_user_portfolio(userid):
    try:
        return dbdict[userid].keys()
    except KeyError:
        print("User not found in database.")


def get_last_weekday():
    previous_day = date.today() - timedelta(days=1)

    while previous_day.weekday() > 4:
        previous_day -= timedelta(days=1)

    return previous_day.strftime("%Y-%m-%d")


def get_stock30(ticker, days = 30):
    core_url = "https://www.alphavantage.co/query"
    parameters = {
        "function": "TIME_SERIES_DAILY",
        "symbol": ticker,
        "apikey": API_KEY
    }

    try:
        response = requests.get(core_url, params=parameters)
        response.raise_for_status()
        data = response.json()

        series = data.get('Time Series (Daily)', {})
        start_date = (date.today() - timedelta(days=days)).strftime("%Y-%m-%d")
        end_date = date.today().strftime("%Y-%m-%d")

        filtered_data = {date: details for date, details in series.items() if start_date <= date <= end_date}

        return {
            "ticker": ticker,
            "values_daily": filtered_data
        }
    except requests.HTTPError as http_err:
        print(f"HTTP error!! code is : {http_err}")
    except Exception as err:
        print(f"error occurred: {err}")

    return None


def get_stock_value(ticker):
    core_url = "https://www.alphavantage.co/query"
    parameters = {
        "function": "TIME_SERIES_DAILY",
        "symbol": ticker,
        "apikey": API_KEY
    }

    try:
        response = requests.get(core_url, params=parameters)
        response.raise_for_status()
        data = response.json()
        last_close_value = data["Time Series (Daily)"][get_last_weekday()]["4. close"]
        return last_close_value
    except requests.HTTPError as err:
        print(f"HTTP error!! for stock {ticker} code is  : {err}")
    except Exception as err:
        print(f"error for stock {ticker}: {err}")
    return None


@app.route("/api/portfolio")
def get_portfolio():
    userid = "user1"
    portfolio = {"username": userid, "total_value": 0}
    user_portfolio = get_user_portfolio(userid)

    for stock in user_portfolio:
        value = get_stock_value(stock)
        portfolio[stock] = {}
        portfolio[stock]["num"] = dbdict[userid][stock]
        portfolio[stock]["last_close_value"] = value
        portfolio["total_value"] += float(value)*dbdict[userid][stock]

    return jsonify(portfolio)


@app.route("/api/portfolio/<stock>")
def get_stock_value_30(stock):
    stock_data = get_stock30(stock)

    if stock_data:
        return jsonify(stock_data)
    else:
        abort(404, description="Error somewhere. Notify Percy")


# @app.route("/api/portfolio/<stock>/<daterange>")
# def get_stock_value_range(stock, daterange):
#     url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={stock}&apikey={API_KEY}"
#     r = requests.get(url)
#     data = r.json()
#     series = data['Time Series (Daily)']
#     # lets use the data between the daterange which is in the format "YYYY-MM-DD_YYYY-MM-DD"
#     start_date, end_date = daterange.split("_")
#     filtered_data = {date: details for date, details in series.items() if start_date <= date <= end_date}
#     past_stock={}
#     past_stock["symbol"]=stock
#     past_stock["values_daily"]=filtered_data
#     return jsonify(past_stock)


if __name__ == "__main__":
    app.run(debug = True)