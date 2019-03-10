"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendMessage = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var sendMessage =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(toAccount, message, subject) {
    var useTestAccount,
        fromAccount,
        transporter,
        mailOptions,
        info,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            useTestAccount = _args.length > 3 && _args[3] !== undefined ? _args[3] : false;
            _context.prev = 1;

            if (!(useTestAccount === true)) {
              _context.next = 8;
              break;
            }

            _context.next = 5;
            return _nodemailer.default.createTestAccount();

          case 5:
            fromAccount = _context.sent;
            _context.next = 9;
            break;

          case 8:
            fromAccount = {
              user: process.env.SenderEmail,
              password: process.env.SenderPassword
            };

          case 9:
            transporter = _nodemailer.default.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: fromAccount.user,
                pass: fromAccount.pass
              }
            });
            console.log(transporter);
            mailOptions = {
              from: '"Search Sender"',
              to: toAccount,
              subject: "Your Search Results for ".concat(subject),
              html: message
            };
            _context.next = 14;
            return transporter.sendMail(mailOptions);

          case 14:
            info = _context.sent;
            console.log("Message sent: ", info.messageId);
            _context.next = 21;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](1);
            console.error(_context.t0);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 18]]);
  }));

  return function sendMessage(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.sendMessage = sendMessage;
//# sourceMappingURL=Nodemailer.js.map