import canvas from 'canvas';
import fetch from 'node-fetch';
import * as faceapi from 'face-api.js'

export const monkeyPatchFaceApiEnv = () => {
    const { Canvas, Image, ImageData } = canvas;
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
    faceapi.env.monkeyPatch({ fetch: fetch });
}