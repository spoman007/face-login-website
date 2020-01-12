const canvas = require("canvas");
import { MODELS_URL, labeledFaceDescriptors, faceMatcher, port, labeled_images } from "./index";
export const load = () => Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_URL),
  faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_URL),
  faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_URL)
]).then(start);
const start = async () => {
  labeledFaceDescriptors = await loadLabeledImages();
  faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
  console.log(`Server listening on port ${port}`);
};
const loadLabeledImages = () => {
  const labels = ['Sandeep', 'Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark'];
  return Promise.all(labels.map(async (label) => {
    const descriptions = [];
    for (let i = 1; i <= 2; i++) {
      const img = await canvas.loadImage(`${labeled_images}\\${label}\\${i}.jpg`);
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      descriptions.push(detections.descriptor);
    }
    return new faceapi.LabeledFaceDescriptors(label, descriptions);
  }));
};
