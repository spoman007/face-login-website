require('@tensorflow/tfjs-node');
import express from "express"
import cors from 'cors';
import 'dotenv/config';
import * as faceapi from 'face-api.js'
import path from 'path';
import multer from 'multer'
import canvas from 'canvas'
import fetch from 'node-fetch';
import fs from 'fs'



//Constants Declaration
const MODELS_URL = path.join(__dirname, '/../models');
const CAPTURED_IMG_URL = path.join(__dirname, '../uploads/Capture.jpg')
const LABELED_IMAGES_URL = path.join(__dirname, '/../labeled_images');


//File Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'))
  },
  filename: function (req, file, cb) {
    cb(null, 'Capture.jpg')
  }
})
const uploadSingle = multer({ storage: storage })

const multiStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `${LABELED_IMAGES_URL}/${req.body.label}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, path.join(dir))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

const uploadMultiple = multer({ storage: multiStorage })


const { Canvas, Image, ImageData } = canvas;


const app = express()

const port = process.env.PORT || 3000

let labeledFaceDescriptors = null;
let faceMatcher = null;

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
faceapi.env.monkeyPatch({ fetch: fetch });

app.use(cors())
app.use(express.static('public'))
app.use(express.json());



app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});
app.post('/', uploadSingle.single('image'), async (req, res) => {
  const image = await canvas.loadImage(`${CAPTURED_IMG_URL}`)

  const displaySize = { width: image.width, height: image.height }

  const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
  const resizedDetections = faceapi.resizeResults(detections, displaySize)
  const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
  return res.send(results);
});

app.post('/register', uploadMultiple.array('image'), async (req, res) => {
  load();
  return res.send({ label: req.body.label });
})



const load = () => Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_URL),
  faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_URL),
  faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_URL)
]).then(start)

const start = async () => {
  labeledFaceDescriptors = await loadLabeledImages();
  faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  console.log(`Server listening on port ${port}`);
}

const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory())

const loadLabeledImages = () => {
  const labels = dirs(LABELED_IMAGES_URL)
  return Promise.all(
    labels.map(async label => {

      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await canvas.loadImage(`${LABELED_IMAGES_URL}\\${label}\\${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}



app.listen(port, load)