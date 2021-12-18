import numpy as np
import pandas as pd
import cv2

import utils
import os

# data
data = pd.read_csv(r'C:\Users\pimto\Downloads\Numbers 2D.csv')  # path of the .csv file



count = 0  # initialize counter
image = np.zeros((21,21,1))  # empty matrix
for i in range(21):
  for j in range(21):
    loc = int(21+j)
    pix = data.iloc[loc]
    pix = pix['NUMBER:']
    image[i,j]=pix/10255
image = cv2.cvtColor(image.astype(np.uint8), cv2.COLOR_GRAY2BGR)
cv2.imshow("image", image)
  # cv2.waitKey(0)  # closes the image window when you press a key
 # count+=1  # counter to save the images with different name
res = cv2.imwrite("image.png",image) # path of location
print(res)  # if false, something went wrong