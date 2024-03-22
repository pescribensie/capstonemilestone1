import json
import requests
import os
from flask import Flask, request, jsonify, abort
from dotenv import load_dotenv
from datetime import date, timedelta
from flask_cors import CORS
from sqlalchemy.pool import NullPool
import oracledb
from models import db, USERS, STOCKS
from flask_sqlalchemy import SQLAlchemy
import jwt
import datetime
from functools import wraps
from werkzeug.security import check_password_hash
import logging




# Cargar las variables de entorno desde el archivo .env
load_dotenv()
API_KEY = os.getenv("ALPHA_VANTAGE_KEY")

# Inicializar la aplicación Flask y configurar CORS
app = Flask(__name__)
CORS(app)

#(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.eu-madrid-1.oraclecloud.com))(connect_data=(service_name=g78d0608a013864_capstonedb_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))
# Datos de conexión a la base de datos Oracle
un = 'BACKEND'
pw = 'PepperoniPizza1!'
dsn = '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.eu-madrid-1.oraclecloud.com))(connect_data=(service_name=g78d0608a013864_capstonedb_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'

# Crear un pool de conexiones a la base de datos
pool = oracledb.create_pool(user=un, password=pw, dsn=dsn)

# Configuración de SQLAlchemy para Flask
app.config['SQLALCHEMY_DATABASE_URI'] = f'oracle+oracledb://{un}:{pw}@{dsn}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'creator': pool.acquire,
    'poolclass': NullPool
}
app.config['SQLALCHEMY_ECHO'] = True  # cambiar en prod
app.config['SECRET_KEY'] = 'your_secret_key'

# Inicializar la base de datos con la aplicación
db.init_app(app)

# with app.app_context():
#     db.create_all()



# with open("userdb.json", 'r') as db:
#     dbdict = json.load(db)

# def get_user_portfolio(userid):
#     try:
#         return dbdict[userid].keys()
#     except KeyError:
#         print("User not found in database.")



# @app.route('/api/login', methods=['POST'])
# def login():
#     auth = request.json
#
#     user = USERS.query.filter_by(USERNAME=auth.get('username')).first()
#     if user and user.PASSWORD == auth.get('password'):  # Pass check
#         token = jwt.encode({
#             'userid': user.USERID,
#             'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
#         }, app.config['SECRET_KEY'])
#         return jsonify({'token': token})
#
#     return jsonify({'message': 'Invalid credentials'}), 401

from werkzeug.security import check_password_hash


@app.route('/api/login', methods=['POST'])
def login():
    try:
        auth = request.json
        username = auth.get('username')
        password = auth.get('password')

        user = USERS.query.filter_by(USERNAME=username).first()

        if not user:
            return jsonify({'message': 'User not found'}), 404

        # Perform the hash check and print the result for debugging
        hash_check_result = check_password_hash(user.PASSWORD, password)
        print(f"Hash check result for user {username}: {hash_check_result}")  # Debug print
        logging.info(f"Hash check result for user {username}: {hash_check_result}")  # Logging

        if hash_check_result:
            token = jwt.encode({
                'userid': user.USERID,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, app.config['SECRET_KEY'], algorithm="HS256")
            return jsonify({'token': token})
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        logging.error(f'Error in login: {str(e)}')  # Log any error
        return jsonify({'message': 'Internal Server Error', 'error': str(e)}), 500

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            #current_user = USERS.query.filter_by(USERID=data['userid']).first()
        except ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401  # expirado
        except DecodeError:
            return jsonify({'message': 'Token is invalid'}), 401  # invalido
        except Exception as e:
            return jsonify({'message': 'An error occurred during token verification', 'error': str(e)}), 500  # otross

        return f(*args, **kwargs)
        #return f(current_user, *args, **kwargs)


    return decorated

# Función para obtener el portafolio de un usuario
def get_user_portfolio(userid):
    user = USERS.query.filter_by(USERID=userid).first()
    if user:
        return [stock.Symbol for stock in user.stocks]
    else:
        print("User not found in database.")
        return []

# Función para obtener el último día laborable
def get_last_weekday():
    previous_day = date.today() - timedelta(days=1)

    while previous_day.weekday() > 4:
        previous_day -= timedelta(days=1)

    return previous_day.strftime("%Y-%m-%d")

# Función para obtener los datos de un stock en los últimos 30 días
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

# Función para obtener el valor de cierre del último día laborable de un stock
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


# @app.route("/api/portfolio")
# def get_portfolio():
#     userid = "user1"
#     portfolio = {"username": userid, "total_value": 0}
#     user_portfolio = get_user_portfolio(userid)
#
#     for stock in user_portfolio:
#         value = get_stock_value(stock)
#         portfolio[stock] = {}
#         portfolio[stock]["num"] = dbdict[userid][stock]
#         portfolio[stock]["last_close_value"] = value
#         portfolio["total_value"] += float(value)*dbdict[userid][stock]
#
#     return jsonify(portfolio)

# Ruta de la API para obtener el portafolio
@app.route("/api/portfolio")
@token_required
def get_portfolio():

    userid = 1

    user = USERS.query.filter_by(USERID=userid).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    portfolio = {"username": user.USERNAME, "total_value": 0.0}
    for stock in user.stocks:
        value = get_stock_value(stock.SYMBOL)
        if value:
            float_value = float(value)
            portfolio[stock.SYMBOL] = {
                "num_stocks": stock.QUANTITY,
                "last_close": float_value
            }
            portfolio["total_value"] += float_value * stock.QUANTITY

    return jsonify(portfolio)
# Ruta de la API para obtener los valores de un stock en los últimos 30 días
@app.route("/api/portfolio/<stock>")
@token_required
def get_stock_value_30(stock):
    stock_data = get_stock30(stock)

    if stock_data:
        return jsonify(stock_data)
    else:
        abort(404, description="Error somewhere. Notify Percy")

# Ruta de la API para obtener los valores de un stock en un rango de fechas específico
@app.route("/api/portfolio/<stock>/<daterange>")
@token_required
def get_stock_value_range(stock, daterange):
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={stock}&apikey={API_KEY}"
    r = requests.get(url)
    data = r.json()
    series = data['Time Series (Daily)']
    # Usar los datos entre el rango de fechas especificado en el formato "YYYY-MM-DD_YYYY-MM-DD"
    start_date, end_date = daterange.split("_")
    filtered_data = {date: details for date, details in series.items() if start_date <= date <= end_date}
    past_stock={}
    past_stock["symbol"]=stock
    past_stock["values_daily"]=filtered_data
    return jsonify(past_stock)

# Ruta de la API para actualizar la información de un usuario
@app.route("/api/update_user", methods=['POST'])
@token_required
def update_user():
    try:
        data = request.json # Obtener los datos enviados por el usuario
        symbol = data.get('symbol') # Obtener el símbolo del stock
        quantity = data.get('quantity') # Obtener la cantidad de acciones
        user_id = 1  # ID del usuario (estático en este ejemplo)

        # Buscar si el stock ya existe para el usuario
        stock = STOCKS.query.filter_by(USERID=user_id, SYMBOL=symbol).first()

        if stock:
            if quantity == 0: # Si la cantidad es 0, eliminar el stock
                db.session.delete(stock)
            else: # Actualizar la cantidad del stock
                stock.QUANTITY = quantity
            db.session.commit() # Guardar los cambios en la base de datos
            return jsonify({"message": "Stock updated successfully"}), 200
        else:
            if quantity > 0: # Si el stock no existe y la cantidad es mayor a 0, agregar el nuevo stock
                new_stock = STOCKS(SYMBOL=symbol, QUANTITY=quantity, USERID=user_id)
                db.session.add(new_stock)
                db.session.commit() # Guardar los cambios en la base de datos
                return jsonify({"message": "New stock added successfully"}), 200
            else:
                return jsonify({"message": "No stock to add and quantity is zero"}), 200
    except Exception as e:
        db.session.rollback() # En caso de error, revertir los cambios
        return jsonify({"error": str(e)}), 500
# Punto de entrada principal para la aplicación Flask
if __name__ == "__main__":
    app.run(debug = True)  # Iniciar la aplicación en modo depuración