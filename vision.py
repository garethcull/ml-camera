import io
import os

# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types

# Set Google API authentication and set folder where images are stored
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = [INSERT YOUR CLIENT KEY]

def label_image(img):
    
    """
    
    Background: This method will send the image to Google's Vision API to detect what the image is.
    
    Parameters:
    
        img: This is the image that was just taken from the camera app (client side)
    
    Return:
    
        labels: A descriptive array of labels returned from the Google Vision API - about the image 
    
    """
    
    # Instantiates a client
    client = vision.ImageAnnotatorClient()

    # The name of the image file to annotate
    file_name = os.path.join(os.path.dirname(__file__),img)

    # Loads the image into memory
    with io.open(file_name, 'rb') as image_file:
        content = image_file.read()

    image = types.Image(content=content)
    
    #### Performs label detection on the image file ###
    response = client.label_detection(image=image)
    
    data = []
    
    #print(response)
    labels = response.label_annotations
    #print('Labels:')
    for label in labels:
        data.append([label.description,label.score])
    
    return data


def extract_text(img):
    
    """
    
    Background: This method will send the image to Google's Vision API to detect and extract any text on the image.
    
    Parameters:
    
        img: This is the image that was just taken from the camera app (client side)
    
    Return:
    
        labels: A descriptive array of labels returned from the Google Vision API - about the image 
    
    """
    
    # Instantiates a client
    client = vision.ImageAnnotatorClient()
    
    print(img)

    # The name of the image file to annotate
    file_name = os.path.join(os.path.dirname(__file__),img)

    # Loads the image into memory
    with io.open(file_name, 'rb') as image_file:
        content = image_file.read()

    image = types.Image(content=content)


    ### For Text Detection #### 
    response = client.text_detection(image=image)
    texts = response.text_annotations

    data = []
    
    #Loop through all of the images text.
    for text in texts:
            data.append(text.description)
            print('\n"{}"'.format(text.description))

            vertices = (['({},{})'.format(vertex.x, vertex.y)
                        for vertex in text.bounding_poly.vertices])

            print('bounds: {}'.format(','.join(vertices)))
    
    return data
