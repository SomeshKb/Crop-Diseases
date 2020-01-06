import urllib.request
import numpy as np
import os
from keras import backend as K
from keras.models import model_from_json
import json
import pdb

EPOCHS = 25
INIT_LR = 1e-3
BS = 32
default_image_size = tuple((256, 256))
image_size = 0
width=256
height=256
depth=3



def getModel():
    model = None
    with open('./Model/model_num.json', 'r') as myfile:
        data=myfile.read()
 
        # obj = json.loads(data)
    model = model_from_json(data)
    # print(model.summary())
    if(os.path.exists('./Model/my_model.h5')):
        # print('Model exist')
 
        model.load_weights('./Model/my_model.h5')
 

    else:
        # print('Beginning file download with urllib2...')
        url = 'https://firebasestorage.googleapis.com/v0/b/ml-model-2762c.appspot.com/o/model_num.h5?alt=media&token=ea7ec037-64c5-44fe-aa51-aa39a7fb9673'
        urllib.request.urlretrieve(url, './Model/my_model.h5')
        model.load_weights('./Model/my_model.h5')

    return model


def convert_image_to_array(image_dir):
    try:
        image = cv2.imread(image_dir)
        if image is not None :
            image = cv2.resize(image, default_image_size)   
            return img_to_array(image)
        else :
            return np.array([])
    except Exception as e:
        # print(f"Error : {e}")
        return None

def predict(image):

    # test_image =  convert_image_to_array('/content/ph.jpg')
    # test_image.shape
     
    model = getModel()
     
    resize_image = image.reshape((1,) + image.shape)

    # np.argmax(model.predict(resize_image))

    list = ['Pepper__bell___Bacterial_spot', 'Pepper__bell___healthy',
     'Potato___Early_blight', 'Potato___Late_blight' ,'Potato___healthy',
     'Tomato_Bacterial_spot' ,'Tomato_Early_blight' ,'Tomato_Late_blight',
     'Tomato_Leaf_Mold', 'Tomato_Septoria_leaf_spot',
     'Tomato_Spider_mites_Two_spotted_spider_mite' ,'Tomato__Target_Spot',
     'Tomato__Tomato_YellowLeaf__Curl_Virus', 'Tomato__Tomato_mosaic_virus',
     'Tomato_healthy']

    result = list[np.argmax(model.predict(resize_image))]    
    K.clear_session()   
    return result

# https://firebasestorage.googleapis.com/v0/b/ml-model-2762c.appspot.com/o/model_num.h5?alt=media&token=ea7ec037-64c5-44fe-aa51-aa39a7fb9673
# https://firebasestorage.googleapis.com/v0/b/ml-model-2762c.appspot.com/o/model_num.json?alt=media&token=c057ea13-9d5b-4355-9e99-e1556fe40058