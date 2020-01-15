require('@tensorflow/tfjs-node');
import express from "express"
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import multer from 'multer'
import fs from 'fs'
import { load, identifyFace } from "./faceRecognition";
import { LABELED_IMAGES_URL, TEMP_UPLOAD_FOR_LOGIN_URL, LOGIN_IMG_NAME, PORT } from './constants'



const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, TEMP_UPLOAD_FOR_LOGIN_URL),
  filename: (req, file, cb) => cb(null, LOGIN_IMG_NAME)
})
const uploadSingle = multer({ storage: storage })

const multiStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `${LABELED_IMAGES_URL}/${req.body.label}`;
    !fs.existsSync(dir) ? fs.mkdirSync(dir) : null;
    cb(null, path.join(dir))
  },
  filename: (req, file, cb) => cb(null, file.originalname)
})

const uploadMultiple = multer({ storage: multiStorage })

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(express.json());


app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});
app.post('/', uploadSingle.single('image'), async (req, res) => {
  const results = await identifyFace();
  return res.send(results);
});
app.post('/register', uploadMultiple.array('image'), async (req, res) => {
  load();
  return res.send({ label: req.body.label });
})


app.listen(PORT, load)
