import numpy as np
import pandas as pd
import cv2

import utils
import os

# data
data = pd.read_csv(r'C:\Users\pimto\Downloads\Numbers 2D.csv')  # path of the .csv file

#print(data.shape)  # to check the shape
#print(data.head(5))  # print the first 5 lines of the data

def convert2image(row):
    pixels = row['NUMBER:']
    print(pixels)
    img = np.array(pixels.split())
    img = img.reshape(48, 48)  # dimensions of the image
    image = np.zeros((48,48,3))  # empty matrix
    image[:,:,0] = img
    image[:,:,1] = img
    image[:,:,2] = img
    return image.astype(np.uint8) # return the image



count = 0  # initialize counter
for i in range(1, data.shape[0]):  #data.shape[0] gives no. of rows
  face = data.iloc[i]  # remove one row from the data
  img = convert2image(face)  # send this row of to the function
  cv2.imshow("image", img)
  # cv2.waitKey(0)  # closes the image window when you press a key
  count+=1  # counter to save the images with different name
  cv2.imwrite(r'C:/Users/pimto/Downloads/img'+ str(count) +'.jpg',img) # path of location