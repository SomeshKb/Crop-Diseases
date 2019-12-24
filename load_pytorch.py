# -*- coding: utf-8 -*-
"""Load_Pytorch.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1Uz6vjTmmGcxZubQ6NeTFVQeaxvA8fepQ

<a href="https://colab.research.google.com/github/SomeshKb/Rice-Diseases/blob/master/Load_Pytorch.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>
"""

# Commented out IPython magic to ensure Python compatibility.
import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import os
# %matplotlib inline
# %config InlineBackend.figure_format = 'retina'
import io

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import torch
from torch import nn, optim
import torch.nn.functional as F
import torchvision
from torchvision import datasets, transforms, models
from torch.autograd import Variable
from torch.utils.data.sampler import SubsetRandomSampler

classes=['LeafBlast', 'BrownSpot', 'Healthy', 'Hispa']

#helper function to un-normalize and display an image
def imshow(img):
    img = img / 2 + 0.5 #unnormalize
    plt.imshow(np.transpose(img, (1,2,0)))

# Specify model architecture
# Load the pretrained model from pytorch's library and stored it in model_transfer
model_transfer = models.googlenet(pretrained=True)

# Check if GPU is available
use_cuda = torch.cuda.is_available()
if use_cuda:
    model_transfer = model_transfer.cuda()

#Lets read the fully connected layer
print(model_transfer.fc.in_features)
print(model_transfer.fc.out_features)

for param in model_transfer.parameters():
    param.requires_grad=True

# Define n_inputs takes the same number of inputs from pre-trained model
n_inputs = model_transfer.fc.in_features #refer to the fully connected layer only

# Add last linear layer (n_inputs -> 4 classes). In this case the ouput is 4 classes
# New layer automatically has requires_grad = True
last_layer = nn.Linear(n_inputs, len(classes))

model_transfer.fc = last_layer

# If GPU is available, move the model to GPU
if use_cuda:
    model_transfer = model_transfer.cuda()
  
# Check to see the last layer produces the expected number of outputs
print(model_transfer.fc.out_features)

# Specify loss function and optimizer
criterion_transfer = nn.CrossEntropyLoss()
optimizer_transfer = optim.SGD(model_transfer.parameters(), lr=0.001, momentum=0.9)

model_transfer.load_state_dict(torch.load('model_transfer.pt'))

from PIL import Image
def transform_image(image_bytes):
    my_transforms = transforms.Compose([transforms.Resize(225),
                                        transforms.CenterCrop(224),
                                        transforms.ToTensor(),transforms.Normalize(
                                            [0.485, 0.456, 0.406],
                                            [0.229, 0.224, 0.225])])
    image = Image.open(io.BytesIO(image_bytes))
    return my_transforms(image).unsqueeze(0)

def predict_result(path):
    with open(path, 'rb') as f:
        image_bytes = f.read()
        tensor = transform_image(image_bytes=image_bytes)
        # print(tensor)
        model_transfer.cuda()
        # tensor.numpy()
        tensor=tensor.cuda()
        # print(tensor.type())
        # print(model_transfer.type())
        y=model_transfer(tensor)
        _,preds_tensor = torch.max(y,1)
        preds = np.squeeze(preds_tensor.numpy()) if not use_cuda else np.squeeze(preds_tensor.cpu().numpy())
        print(classes[preds])
        return preds;

predict_result('/content/3.jpg')

