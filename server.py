from flask import Flask
from flask import jsonify
from flask import request
from load_pytorch import predict_result
import base64
app = Flask(__name__)


@app.route('/')
def hello_world():
    return jsonify(text= 'hello')

@app.route('/api/upload', methods = ['POST'])
def upload_file():
    data = request.get_json()
    # base64 string
    base64Image = data['image']
    return jsonify(success= 'true')


if __name__ == '__main__':
    app.run()