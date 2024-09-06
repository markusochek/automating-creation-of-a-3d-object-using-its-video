import os
from flask import Flask, flash, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

import service

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif', 'mp4'}

app = Flask(__name__)
CORS(app)


@app.route('/videos', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        flash('No file part')

    file = request.files['file']
    if file.filename == '':
        flash('No selected file')

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join('videos', filename))
        name_modal = service.create_3d_modal(filename)
        print(name_modal)
        return send_from_directory('models', name_modal)
    return None


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


app.run(host='localhost', port=3000)
