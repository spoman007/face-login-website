"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identifyFace = exports.load = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _canvas = _interopRequireDefault(require("canvas"));

var faceapi = _interopRequireWildcard(require("face-api.js"));

var _fs = _interopRequireDefault(require("fs"));

var _monkeyPatch = require("./monkeyPatch");

var _path = _interopRequireDefault(require("path"));

var _constants = require("./constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

(0, _monkeyPatch.monkeyPatchFaceApiEnv)();
var labeledFaceDescriptors = null;
var faceMatcher = null;

var load = function load() {
  return Promise.all([faceapi.nets.faceRecognitionNet.loadFromDisk(_constants.MODELS_URL), faceapi.nets.faceLandmark68Net.loadFromDisk(_constants.MODELS_URL), faceapi.nets.ssdMobilenetv1.loadFromDisk(_constants.MODELS_URL), faceapi.nets.ageGenderNet.loadFromDisk(_constants.MODELS_URL), faceapi.nets.faceExpressionNet.loadFromDisk(_constants.MODELS_URL)]).then(start);
};

exports.load = load;

var identifyFace =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var image, displaySize, detections, resizedDetections, results;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _canvas["default"].loadImage("".concat(_constants.CAPTURED_IMG_URL));

          case 2:
            image = _context.sent;
            displaySize = {
              width: image.width,
              height: image.height
            };
            _context.next = 6;
            return faceapi.detectSingleFace(image).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptor();

          case 6:
            detections = _context.sent;
            resizedDetections = faceapi.resizeResults(detections, displaySize);
            results = faceMatcher.findBestMatch(resizedDetections.descriptor);
            return _context.abrupt("return", _objectSpread({}, results, {}, resizedDetections));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function identifyFace() {
    return _ref.apply(this, arguments);
  };
}();

exports.identifyFace = identifyFace;

var start =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return loadLabeledImages();

          case 2:
            labeledFaceDescriptors = _context2.sent;
            faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
            console.log("Server listening on port ".concat(_constants.PORT));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function start() {
    return _ref2.apply(this, arguments);
  };
}();

var dirs = function dirs(p) {
  return _fs["default"].readdirSync(p).filter(function (f) {
    return _fs["default"].statSync(_path["default"].join(p, f)).isDirectory();
  });
};

var loadLabeledImages = function loadLabeledImages() {
  var labels = dirs(_constants.LABELED_IMAGES_URL);
  return Promise.all(labels.map(
  /*#__PURE__*/
  function () {
    var _ref3 = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee3(label) {
      var descriptions, i, img, detections;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              descriptions = [];
              i = 1;

            case 2:
              if (!(i <= 2)) {
                _context3.next = 13;
                break;
              }

              _context3.next = 5;
              return _canvas["default"].loadImage("".concat(_constants.LABELED_IMAGES_URL, "/").concat(label, "/").concat(i, ".jpg"));

            case 5:
              img = _context3.sent;
              _context3.next = 8;
              return faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

            case 8:
              detections = _context3.sent;
              descriptions.push(detections.descriptor);

            case 10:
              i++;
              _context3.next = 2;
              break;

            case 13:
              return _context3.abrupt("return", new faceapi.LabeledFaceDescriptors(label, descriptions));

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }()));
};