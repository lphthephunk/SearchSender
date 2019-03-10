"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchCraigslist = void 0;

var _nodeCraigslist = _interopRequireDefault(require("node-craigslist"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var searchCraigslist =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(city, keywords) {
    var category,
        hasPic,
        searchTitlesOnly,
        client,
        options,
        posts,
        result,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            category = _args.length > 2 && _args[2] !== undefined ? _args[2] : "sss";
            hasPic = _args.length > 3 && _args[3] !== undefined ? _args[3] : true;
            searchTitlesOnly = _args.length > 4 && _args[4] !== undefined ? _args[4] : false;
            client = new _nodeCraigslist.default.Client({
              city: city
            });
            options = {
              hasPic: hasPic,
              searchTitlesOnly: searchTitlesOnly,
              category: category
            };
            _context.prev = 5;
            posts = [];
            _context.next = 9;
            return client.search(options, keywords);

          case 9:
            result = _context.sent;
            result.forEach(function (_ref2) {
              var price = _ref2.price,
                  date = _ref2.date,
                  title = _ref2.title,
                  url = _ref2.url;
              posts.push("<b>Title: ".concat(title, "</b><br/>Price: ").concat(price, "<br/>Posting Date: ").concat(date, "<br/>Link: ").concat(url));
            });
            return _context.abrupt("return", posts);

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](5);
            console.error(_context.t0);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 14]]);
  }));

  return function searchCraigslist(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.searchCraigslist = searchCraigslist;
//# sourceMappingURL=postRetriever.js.map