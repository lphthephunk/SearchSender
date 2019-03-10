"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cheerio = _interopRequireDefault(require("cheerio"));

var _requestPromise = _interopRequireDefault(require("request-promise"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default =
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var result, $, cities;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return (0, _requestPromise.default)("https://geo.craigslist.org/iso/us");

        case 3:
          result = _context.sent;

          if (!result) {
            _context.next = 12;
            break;
          }

          $ = _cheerio.default.load(result);
          cities = [];
          $(".geo-site-list").find("li").map(function (i, li) {
            var cityName = $(this).text();
            var refSplit = $(this).find("a").attr("href").split("."); // we want the info in between http:// and .craigslist
            // this should be at the 0th index

            var ref = refSplit[0].replace("https://", "");
            cities.push({
              cityName: cityName,
              ref: ref
            });
          });
          cities = cities.sort(function (a, b) {
            if (a.cityName.toLowerCase() < b.cityName.toLowerCase()) {
              return -1;
            }

            if (a.cityName.toLowerCase() > b.cityName.toLowerCase()) {
              return 1;
            }

            return 0;
          });
          return _context.abrupt("return", cities);

        case 12:
          throw "No cities found";

        case 13:
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          throw _context.t0;

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, null, [[0, 15]]);
}));

exports.default = _default;
//# sourceMappingURL=getCities.js.map