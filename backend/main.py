# conda install pytorch torchvision cpuonly -c pytorch
# conda install flask pandas
# pip install pyrebase4
# pip install flask_cors
# pip install opencv-python
# pip install pyyaml
# pip install -r https://raw.githubusercontent.com/ultralytics/yolov5/master/requirements.txt
import torch
from flask import Flask, request
import os

from flask_cors import CORS
import pyrebase

app = Flask(__name__)
cors = CORS(app)


@app.route("/detect", methods=['GET', 'POST'])
def hello():
    data = request.form['name']
    filename = request.form['filename']
    model_select = request.form['model']
    print("name is :")
    print(data)
    # data=data+'.jpg'
    num = len([i for i in os.listdir('C:/Users/siddh/OneDrive/Desktop/web projects/backend/runs/detect')])
    if num == 1:
        folder = 'exp'
    else:
        folder = 'exp' + str(num + 1)
    if model_select == '1':
        model = torch.hub.load('ultralytics/yolov5', 'custom',
                               path='C:/Users/siddh/OneDrive/Desktop/web projects/backend/static/best (5).pt')
    else:
        model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
    imgs = [data]  # batch of images custom model 1 voc hai
    # Inference
    results = model(imgs)

    # Results
    results.print()
    results.save()  # or .show()

    config = {
        "apiKey": "AIzaSyBfvdS1yhETSR3q0vdxooS1-JDLG6NN7dU",
        "authDomain": "virtualbot-e5bfa.firebaseapp.com",
        "projectId": "virtualbot-e5bfa",
        "databaseURL": "https://console.firebase.google.com/project/virtualbot-e5bfa/storage/virtualbot-e5bfa.appspot.com/files",
        "storageBucket": "virtualbot-e5bfa.appspot.com",
        "messagingSenderId": "602641846681",
        "appId": "1:602641846681:web:58fb9388951a771e304308",
        "measurementId": "G-QXBJWCFY44"
    }

    firebase = pyrebase.initialize_app(config)
    storage = firebase.storage()
    storage.child('output_images/' + model_select + filename).put(
        'C:/Users/siddh/OneDrive/Desktop/web projects/backend/runs/detect/' +
        folder + '/' + 'input_images%2F' + filename)

    imageUrl = str(
        storage.child('output_images/' + model_select + filename).get_url('AIzaSyBfvdS1yhETSR3q0vdxooS1-JDLG6NN7dU'))
    detection_info = results.pandas().xyxy[0]
    l1 = list(detection_info.loc[:, "name"])
    str_output = imageUrl
    for ele in l1:
        str_output += ',' + ele
    print(str_output)

    return str_output


app.run(debug=True)
