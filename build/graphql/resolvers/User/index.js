"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _UserModel = _interopRequireDefault(require("../../../models/UserModel"));

var _jwtAuth = _interopRequireDefault(require("../../../../jwtAuth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = {
  Query: {
    user: function () {
      var _user = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(root, _ref) {
        var email, password, foundUser, valid;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                email = _ref.email, password = _ref.password;
                _context.prev = 1;
                _context.next = 4;
                return _UserModel.default.findOne({
                  email: email
                }).exec();

              case 4:
                foundUser = _context.sent;

                if (!foundUser) {
                  _context.next = 14;
                  break;
                }

                valid = _bcrypt.default.compare(password, foundUser.password);

                if (!valid) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt("return", JSON.stringify({
                  userId: foundUser._id,
                  email: foundUser.email,
                  JWT_TOKEN: _jsonwebtoken.default.sign({
                    id: foundUser._id,
                    email: foundUser.email
                  }, _jwtAuth.default, {
                    expiresIn: "1d"
                  })
                }));

              case 11:
                throw new Error("Incorrect email or password");

              case 12:
                _context.next = 15;
                break;

              case 14:
                throw new Error("Cannot find a user with this email address");

              case 15:
                _context.next = 20;
                break;

              case 17:
                _context.prev = 17;
                _context.t0 = _context["catch"](1);
                throw new Error(_context.t0);

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 17]]);
      }));

      function user(_x, _x2) {
        return _user.apply(this, arguments);
      }

      return user;
    }(),
    users: function () {
      var _users = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(root, args, _ref2) {
        var authenticatedUser, _users2;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                authenticatedUser = _ref2.authenticatedUser;
                _context2.prev = 1;

                if (!authenticatedUser) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 5;
                return _UserModel.default.find({}).populate().exec();

              case 5:
                _users2 = _context2.sent;
                return _context2.abrupt("return", _users2);

              case 9:
                throw new Error("Not authenticated");

              case 10:
                _context2.next = 15;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](1);
                throw new Error(_context2.t0);

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 12]]);
      }));

      function users(_x3, _x4, _x5) {
        return _users.apply(this, arguments);
      }

      return users;
    }()
  },
  Mutation: {
    addUser: function () {
      var _addUser = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(root, _ref3) {
        var email, password, hash, newUser, result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                email = _ref3.email, password = _ref3.password;
                _context3.prev = 1;
                _context3.next = 4;
                return _bcrypt.default.hash(password, 10);

              case 4:
                hash = _context3.sent;
                password = hash;
                newUser = new _UserModel.default({
                  email: email,
                  password: password
                });
                _context3.next = 9;
                return newUser.save();

              case 9:
                result = _context3.sent;

                if (!result) {
                  _context3.next = 14;
                  break;
                }

                return _context3.abrupt("return", JSON.stringify({
                  userId: result._id,
                  email: result.email,
                  JWT_TOKEN: _jsonwebtoken.default.sign({
                    id: result._id,
                    email: result.email
                  }, _jwtAuth.default, {
                    expiresIn: "1d"
                  })
                }));

              case 14:
                throw new Error("Problem registering. Please try again.");

              case 15:
                _context3.next = 20;
                break;

              case 17:
                _context3.prev = 17;
                _context3.t0 = _context3["catch"](1);
                throw new Error(_context3.t0);

              case 20:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[1, 17]]);
      }));

      function addUser(_x6, _x7) {
        return _addUser.apply(this, arguments);
      }

      return addUser;
    }(),
    editUser: function () {
      var _editUser = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(root, _ref4, _ref5) {
        var id, email, password, authenticatedUser, user;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                id = _ref4.id, email = _ref4.email, password = _ref4.password;
                authenticatedUser = _ref5.authenticatedUser;
                _context4.prev = 2;

                if (!authenticatedUser) {
                  _context4.next = 14;
                  break;
                }

                _context4.next = 6;
                return _UserModel.default.findOneAndUpdate({
                  id: id
                }, {
                  $set: {
                    email: email,
                    password: password
                  }
                }).exec();

              case 6:
                user = _context4.sent;

                if (!user) {
                  _context4.next = 11;
                  break;
                }

                return _context4.abrupt("return", user);

              case 11:
                throw new Error("Couldn't find associated user");

              case 12:
                _context4.next = 15;
                break;

              case 14:
                throw new Error("Not authenticated");

              case 15:
                _context4.next = 20;
                break;

              case 17:
                _context4.prev = 17;
                _context4.t0 = _context4["catch"](2);
                throw new Error(_context4.t0);

              case 20:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[2, 17]]);
      }));

      function editUser(_x8, _x9, _x10) {
        return _editUser.apply(this, arguments);
      }

      return editUser;
    }(),
    deleteUser: function () {
      var _deleteUser = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(root, _ref6, _ref7) {
        var id, authenticatedUser, user;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                id = _ref6.id;
                authenticatedUser = _ref7.authenticatedUser;
                _context5.prev = 2;

                if (!authenticatedUser) {
                  _context5.next = 10;
                  break;
                }

                _context5.next = 6;
                return _UserModel.default.findByIdAndRemove({
                  _id: id
                }).exec();

              case 6:
                user = _context5.sent;
                return _context5.abrupt("return", user);

              case 10:
                throw new Error("Not authenticated");

              case 11:
                _context5.next = 16;
                break;

              case 13:
                _context5.prev = 13;
                _context5.t0 = _context5["catch"](2);
                throw new Error(_context5.t0);

              case 16:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[2, 13]]);
      }));

      function deleteUser(_x11, _x12, _x13) {
        return _deleteUser.apply(this, arguments);
      }

      return deleteUser;
    }()
  }
};
exports.default = _default;
//# sourceMappingURL=index.js.map