import canvas from 'canvas'
import * as faceapi from 'face-api.js'
import fs from 'fs'
import { monkeyPatchFaceApiEnv } from './monkeyPatch'
import path from 'path';
import {LABELED_IMAGES_URL, MODELS_URL, CAPTURED_IMG_URL, PORT} from './constants'

monkeyPatchFaceApiEnv();

let labeledFaceDescriptors = null;
let faceMatcher = null;

export const load = () => Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_URL),
    faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_URL),
    faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_URL),
    faceapi.nets.ageGenderNet.loadFromDisk(MODELS_URL),
    faceapi.nets.faceExpressionNet.loadFromDisk(MODELS_URL)
]).then(start);

export const identifyFace = async () => {
    const image = await canvas.loadImage(`${CAPTURED_IMG_URL}`);
    const displaySize = { width: image.width, height: image.height };
    const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptor();
    
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const results = faceMatcher.findBestMatch(resizedDetections.descriptor);
    return {...results, ...resizedDetections};
}


const start = async () => {
    labeledFaceDescriptors = await loadLabeledImages();
    faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    console.log(`Server listening on port ${PORT}`);
}

const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory())

const loadLabeledImages = () => {
    const labels = dirs(LABELED_IMAGES_URL)
    return Promise.all(
        labels.map(async label => {

            const descriptions = []
            for (let i = 1; i <= 2; i++) {
                const img = await canvas.loadImage(`${LABELED_IMAGES_URL}/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }

            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}
