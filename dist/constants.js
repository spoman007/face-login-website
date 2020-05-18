"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PORT = exports.LOGIN_IMG_NAME = exports.TEMP_UPLOAD_FOR_LOGIN_URL = exports.CAPTURED_IMG_URL = exports.MODELS_URL = exports.LABELED_IMAGES_URL = void 0;

var _path = _interopRequireDefault(require("path"));

var LABELED_IMAGES_URL = _path["default"].join(__dirname, '/../labeled_images');

exports.LABELED_IMAGES_URL = LABELED_IMAGES_URL;

var MODELS_URL = _path["default"].join(__dirname, '/../models');

exports.MODELS_URL = MODELS_URL;

var CAPTURED_IMG_URL = _path["default"].join(__dirname, '../uploads/Capture.jpg');

exports.CAPTURED_IMG_URL = CAPTURED_IMG_URL;

var TEMP_UPLOAD_FOR_LOGIN_URL = _path["default"].join(__dirname, '../uploads/');

exports.TEMP_UPLOAD_FOR_LOGIN_URL = TEMP_UPLOAD_FOR_LOGIN_URL;
var LOGIN_IMG_NAME = 'Capture.jpg';
exports.LOGIN_IMG_NAME = LOGIN_IMG_NAME;
var PORT = process.env.PORT || 3000;
exports.PORT = PORT;