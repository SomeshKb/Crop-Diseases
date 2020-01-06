from flask import Flask
from flask import jsonify
from flask import request
import numpy as np
import cv2
import base64
import os
from segment import getSegmented_Leaf
import sys
sys.path.insert(0, '/Model/')

from Model import load_keras
import pdb; # for debugging





app = Flask(__name__)

def imageToCV2(image):
    decoded_data = base64.b64decode(image)
    np_data = np.fromstring(decoded_data,np.uint8)
    img = cv2.imdecode(np_data,cv2.IMREAD_COLOR)
    data = getSegmented_Leaf(img)
    # print('data')
    result = load_keras.predict(data)
    # cv2.imwrite("test.jpg", data)
    # cv2.waitKey(0)
    return result

@app.route('/')
def hello_world():
    return jsonify(text= 'hello')

@app.route('/api/upload', methods = ['POST'])
def upload_file():

    data = request.get_json()
    # base64 string
    # print(data['image'])
    base64Image = data['image']
    # with open("testing_files\images.jpg", "rb") as image_file:
    #     base64Image = base64.b64encode(image_file.read())
    res = imageToCV2(base64Image)
    return jsonify(result = res )


if __name__ == '__main__':
    app.run()

