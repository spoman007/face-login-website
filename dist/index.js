"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

require("dotenv/config");

var _path = _interopRequireDefault(require("path"));

var _multer = _interopRequireDefault(require("multer"));

var _fs = _interopRequireDefault(require("fs"));

var _faceRecognition = require("./faceRecognition");

var _constants = require("./constants");

require('@tensorflow/tfjs-node');

var storage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    return cb(null, _constants.TEMP_UPLOAD_FOR_LOGIN_URL);
  },
  filename: function filename(req, file, cb) {
    return cb(null, _constants.LOGIN_IMG_NAME);
  }
});

var uploadSingle = (0, _multer["default"])({
  storage: storage
});

var multiStorage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    var dir = "".concat(_constants.LABELED_IMAGES_URL, "/").concat(req.body.label);
    !_fs["default"].existsSync(dir) ? _fs["default"].mkdirSync(dir) : null;
    cb(null, _path["default"].join(dir));
  },
  filename: function filename(req, file, cb) {
    return cb(null, file.originalname);
  }
});

var uploadMultiple = (0, _multer["default"])({
  storage: multiStorage
});
var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_express["default"]["static"]('public'));
app.use(_express["default"].json());
app.get('/', function (req, res) {
  return res.send('Received a GET HTTP method');
});
app.post('/', uploadSingle.single('image'),
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res) {
    var results;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _faceRecognition.identifyFace)();

          case 2:
            results = _context.sent;
            return _context.abrupt("return", res.send(results));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.post('/register', uploadMultiple.array('image'),
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(req, res) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            (0, _faceRecognition.load)();
            return _context2.abrupt("return", res.send({
              label: req.body.label
            }));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
app.listen(_constants.PORT, _faceRecognition.load);