"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.monkeyPatchFaceApiEnv = void 0;

var _canvas = _interopRequireDefault(require("canvas"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var faceapi = _interopRequireWildcard(require("face-api.js"));

var monkeyPatchFaceApiEnv = function monkeyPatchFaceApiEnv() {
  var Canvas = _canvas["default"].Canvas,
      Image = _canvas["default"].Image,
      ImageData = _canvas["default"].ImageData;
  faceapi.env.monkeyPatch({
    Canvas: Canvas,
    Image: Image,
    ImageData: ImageData
  });
  faceapi.env.monkeyPatch({
    fetch: _nodeFetch["default"]
  });
};

exports.monkeyPatchFaceApiEnv = monkeyPatchFaceApiEnv;