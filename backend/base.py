import yfinance as yf
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import smartsheet

api = os.environ.get('SMART')
id = int(os.environ.get('ID'))
smart_client = smartsheet.Smartsheet(access_token=api)

app = Flask(__name__)
CORS(app)

def create_sheet_if_not_exists():
    try:
        response = smart_client.Sheets.get_sheet(id)
        return response.data.id
    except:
        spec = smartsheet.models.Sheet({
            'name': 'stocks',
            'columns': [
                {
                    'title': 'symbol',
                    'primary': True,
                    'type': 'TEXT_NUMBER'
                },
                {
                    'title': 'correlation',
                    'type': 'TEXT_NUMBER'
                },
                {
                    'title': 'risk',
                    'type': 'TEXT_NUMBER'
                },
                {
                    'type': 'TEXT_NUMBER',
                    'title': 'equity_return',
                },
                {
                    'type': 'TEXT_NUMBER',
                    'title': 'price',
                },
                {
                    'type': 'CHECKBOX',
                    'title': 'approved',
                    'symbol': 'STAR'
                }
            ]
        })
        sheet = smart_client.Home.create_sheet(spec)
        return sheet.data.id

@app.route('/add_row', methods=['POST'])
def add_row():
    data = request.get_json()
    if 'symbol' in data:
        stock = info(data['symbol'])
        column_ids = {}
        sheet = smart_client.Sheets.get_sheet(id)

        for row in sheet.rows:
            for cell in row.cells:
                if cell.value == stock['symbol']:
                    return jsonify({"message": "Stock already added"}), 200
        
        for column in sheet.columns:
            column_ids[column.title] = column.id

        row = smartsheet.models.Row({
            'to_top': True,
            'cells': [
                smartsheet.models.Cell({
                    'column_id': column_ids['symbol'],  
                    'value': stock['symbol']
                }),
                smartsheet.models.Cell({
                    'column_id': column_ids['correlation'],
                    'value': stock['correlation']
                }),
                smartsheet.models.Cell({
                    'column_id': column_ids['risk'],
                    'value': stock['risk']
                }),
                smartsheet.models.Cell({
                    'column_id': column_ids['equity_return'],
                    'value': stock['equity_return']
                }),
                smartsheet.models.Cell({
                    'column_id': column_ids['price'],
                    'value': stock['price']
                }),
                smartsheet.models.Cell({
                    'column_id': column_ids['approved'],
                    'value': False,
                })
            ]
        })

        smart_client.Sheets.add_rows(id, [row])
        return jsonify({"message": "Row added successfully"}), 200
    else: 
        return jsonify('No symbol provided'), 400 

def info(symbol):
    stock = yf.Ticker(symbol)
    return { "symbol": symbol, 
            "equity_return": str(np.round(stock.info["returnOnEquity"], 2)), 
            "price": str(np.round(stock.info["ask"], 2)), 
            "correlation": str(np.round(stock.info["beta"], 2)) 
            ,"risk": str(np.round(stock.info["overallRisk"], 2)) }


@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    if 'symbol' in data:
        stock = yf.Ticker(data['symbol'])
        return { "name": stock.info["longName"], 
                "description": stock.info["longBusinessSummary"], 
                "price": str(np.round(stock.info["ask"], 2)), 
                "institutions": str(np.round(stock.info["heldPercentInstitutions"], 2)), 
                "beta": str(np.round(stock.info["beta"], 2)) 
                ,"risk": str(np.round(stock.info["overallRisk"], 2)) }, 200
    else: 
        return jsonify('No symbol provided'), 400
    
@app.route('/all_approved', methods=['GET'])
def approved():
    sheet = smart_client.Sheets.get_sheet(id)
    stocks = []
    for row in sheet.rows:
        for cell in row.cells:
            if cell.value == True:
                stock = []
                for cell in row.cells:
                    stock.append(cell.value)
                stocks.append(stock)  
    return jsonify(stocks), 200

@app.route('/all', methods=['GET'])
def all():
    sheet = smart_client.Sheets.get_sheet(id)
    stocks = []
    for row in sheet.rows:
        stock = []
        for cell in row.cells:
            stock.append(cell.value)
        stocks.append(stock)  
    return jsonify(stocks), 200

@app.route('/discuss', methods=['POST'])
def discuss():
    sheet = smart_client.Sheets.get_sheet(id)
    data = request.get_json()
    if "symbol" in data and "comment" in data:
        discussion = smartsheet.models.Discussion({
                        'comment': smartsheet.models.Comment({
                            'text': data['comment']
                        })
                    })
        for row in sheet.rows:
            for cell in row.cells:
                if cell.value == data["symbol"]:
                    smart_client.Discussions.create_discussion_on_row(id, row.id, discussion)                            
                    return jsonify("Comment added"), 200
    return jsonify("Failed to add comment"), 404

if __name__ == '__main__':
   app.run(debug=True, port=5002)