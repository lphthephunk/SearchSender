"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.agenda = void 0;

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _expressGraphql = _interopRequireDefault(require("express-graphql"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _graphql = _interopRequireDefault(require("./server/graphql"));

var _cors = _interopRequireDefault(require("cors"));

var _agenda = _interopRequireDefault(require("agenda"));

var _expressJwt = _interopRequireDefault(require("express-jwt"));

var _Nodemailer = require("./server/utils/Nodemailer");

var _postRetriever = require("./server/utils/craigslist/postRetriever");

var _path = _interopRequireDefault(require("path"));

var _jwtAuth = _interopRequireDefault(require("./jwtAuth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require("dotenv").config();

var app = (0, _express.default)();
var mongURI = "mongodb://heroku_f6rz86m0:tu34o9kicmn3hbaulrt4unt792@ds255740.mlab.com:55740/heroku_f6rz86m0"; //let mongURI = "mongodb://localhost:27017/SearchSender";

var agenda = new _agenda.default();
exports.agenda = agenda;

_mongoose.default.set("useNewUrlParser", true);

_mongoose.default.set("useFindAndModify", false);

_mongoose.default.set("useCreateIndex", true);

_mongoose.default.connect(mongURI).then(function () {
  console.log("MongoDB connected");
  agenda.mongo(_mongoose.default.connection, "jobs", function () {
    agenda.start();
    console.log("Agenda initialized");
    agenda.processEvery("30 seconds");
    console.log("Agenda pulling jobs every 30 seconds");
    agenda.define("send-email-to-user", {
      priority: "high"
    }, function (job, done) {
      try {
        _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var _job$attrs$data, to, searchData, message, posts;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _job$attrs$data = job.attrs.data, to = _job$attrs$data.to, searchData = _job$attrs$data.searchData;
                  message = "";
                  _context.next = 4;
                  return (0, _postRetriever.searchCraigslist)(searchData.city, searchData.searchText, "sss", true, false);

                case 4:
                  posts = _context.sent;

                  if (!posts) {
                    message = "There were no posts matching \"".concat(searchData.searchText, "\" today.");
                  } else {
                    posts.forEach(function (post) {
                      message = message.concat(post, "<br/><br/>");
                    });
                  }

                  _context.next = 8;
                  return (0, _Nodemailer.sendMessage)(to, message, searchData.searchText);

                case 8:
                  done();

                case 9:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))().then(done, done);
      } catch (err) {
        // fail silently
        console.error(err);
      }
    });
  });
}).catch(function (err) {
  console.error(err);
}); // auth middleware


var auth = (0, _expressJwt.default)({
  secret: _jwtAuth.default,
  credentialsRequired: false
});
app.use("/graphql", auth, _bodyParser.default.json(), (0, _cors.default)({
  origin: "http://localhost:3000",
  credentials: false
}), (0, _expressGraphql.default)(function (req) {
  return {
    schema: _graphql.default,
    context: {
      authenticatedUser: req.user
    },
    graphiql: false
  };
}));
app.use(_express.default.static("public"));
app.get("*", function (req, res) {
  res.sendFile(_path.default.resolve(__dirname, "public", "index.html"));
});
app.listen(process.env.PORT || 4000, function () {
  console.log("Express server is running...");
});
var _default = app;
exports.default = _default;
//# sourceMappingURL=server.js.map