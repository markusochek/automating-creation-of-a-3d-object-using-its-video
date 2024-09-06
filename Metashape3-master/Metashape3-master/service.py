import os

import Metashape
import cv2
from Metashape import ModelFormatGLTF


def create_3d_modal(filename):
    doc = Metashape.Document()
    chunk = doc.addChunk()
    cut_video(filename.split(".")[0])
    add_photos_in_chunk(chunk, 'images/' + filename.split(".")[0])
    chunk.matchPhotos(downscale=1, generic_preselection=True, reference_preselection=False)
    chunk.alignCameras()
    chunk.buildDepthMaps(downscale=4, filter_mode=Metashape.AggressiveFiltering)
    chunk.buildPointCloud()
    chunk.buildModel(surface_type=Metashape.Arbitrary, interpolation=Metashape.EnabledInterpolation)
    chunk.buildUV(mapping_mode=Metashape.GenericMapping)
    chunk.buildTexture(blending_mode=Metashape.MosaicBlending, texture_size=4096)
    doc.save("project.psz")
    chunk.exportModel(path='models/' + filename.split(".")[0] + '.glb', format=ModelFormatGLTF)
    return filename.split(".")[0] + '.glb'


def add_photos_in_chunk(chunk, directory):
    for filename in os.listdir(directory):
        chunk.addPhotos(os.path.join(directory, filename))


def cut_video(filename):
    cam = cv2.VideoCapture('videos/' + filename + '.mp4')
    try:
        if not os.path.exists('images/' + filename):
            os.makedirs('images/' + filename)
    except OSError:
        print('Error: Creating directory of images/' + filename)

    currentframe = 0
    while True:
        ret, frame = cam.read()
        if ret:
            if currentframe % 40 == 0:
                name = './images/' + filename + '/frame' + str(currentframe) + '.png'
                print('Creating...' + name)
                cv2.imwrite(name, frame)
            currentframe += 1
        else:
            break
    cam.release()
    cv2.destroyAllWindows()
