import path from 'path';


 export const LABELED_IMAGES_URL = path.join(__dirname, '/../labeled_images');
 export const MODELS_URL = path.join(__dirname, '/../models');
 export const CAPTURED_IMG_URL = path.join(__dirname, '../uploads/Capture.jpg');
 export const TEMP_UPLOAD_FOR_LOGIN_URL = path.join(__dirname, '../uploads/');
 export const LOGIN_IMG_NAME = 'Capture.jpg';
 export const PORT = process.env.PORT || 3000;