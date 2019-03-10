"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SearchCriteriaModel = _interopRequireDefault(require("../../../models/SearchCriteriaModel"));

var _UserModel = _interopRequireDefault(require("../../../models/UserModel"));

var _server = require("../../../../server");

var _scheduler = require("../../../utils/agenda/scheduler");

var _getCities2 = _interopRequireDefault(require("../../../external/craigslist/getCities"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = {
  Query: {
    schedule: function () {
      var _schedule = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(root, _ref, _ref2) {
        var userId, executionDay, authenticatedUser, _schedule2;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                userId = _ref.userId, executionDay = _ref.executionDay;
                authenticatedUser = _ref2.authenticatedUser;
                _context.prev = 2;

                if (!authenticatedUser) {
                  _context.next = 14;
                  break;
                }

                _context.next = 6;
                return _SearchCriteriaModel.default.findOne({
                  userId: userId,
                  executionDay: executionDay
                }).exec();

              case 6:
                _schedule2 = _context.sent;

                if (!_schedule2) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt("return", _schedule2);

              case 11:
                throw new Error("Could not find an associated schedule.");

              case 12:
                _context.next = 15;
                break;

              case 14:
                throw new Error("Not authenticated");

              case 15:
                _context.next = 20;
                break;

              case 17:
                _context.prev = 17;
                _context.t0 = _context["catch"](2);
                throw new Error(_context.t0);

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 17]]);
      }));

      function schedule(_x, _x2, _x3) {
        return _schedule.apply(this, arguments);
      }

      return schedule;
    }(),
    schedules: function () {
      var _schedules = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(root, _ref3, _ref4) {
        var userId, authenticatedUser, _schedules2;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                userId = _ref3.userId;
                authenticatedUser = _ref4.authenticatedUser;
                _context2.prev = 2;

                if (!authenticatedUser) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 6;
                return _SearchCriteriaModel.default.find({
                  userId: userId
                }).populate().exec();

              case 6:
                _schedules2 = _context2.sent;

                if (!_schedules2) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt("return", _schedules2);

              case 9:
                _context2.next = 12;
                break;

              case 11:
                throw new Error("Not authenticated");

              case 12:
                _context2.next = 17;
                break;

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2["catch"](2);
                throw new Error(_context2.t0);

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2, 14]]);
      }));

      function schedules(_x4, _x5, _x6) {
        return _schedules.apply(this, arguments);
      }

      return schedules;
    }(),
    getCities: function () {
      var _getCities = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(root, args, _ref5) {
        var authenticatedUser, cities;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                authenticatedUser = _ref5.authenticatedUser;
                _context3.prev = 1;

                if (!authenticatedUser) {
                  _context3.next = 9;
                  break;
                }

                _context3.next = 5;
                return (0, _getCities2.default)();

              case 5:
                cities = _context3.sent;
                return _context3.abrupt("return", cities);

              case 9:
                throw new Error("Not authenticated");

              case 10:
                _context3.next = 15;
                break;

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](1);
                throw new Error(_context3.t0);

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[1, 12]]);
      }));

      function getCities(_x7, _x8, _x9) {
        return _getCities.apply(this, arguments);
      }

      return getCities;
    }()
  },
  Mutation: {
    addSchedule: function () {
      var _addSchedule = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(root, _ref6, _ref7) {
        var userId, executionDays, executionTime, searchText, searchCity, authenticatedUser, newSchedule, res, foundUser, job;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                userId = _ref6.userId, executionDays = _ref6.executionDays, executionTime = _ref6.executionTime, searchText = _ref6.searchText, searchCity = _ref6.searchCity;
                authenticatedUser = _ref7.authenticatedUser;
                _context4.prev = 2;
                console.log("wtf: ", _server.agenda.agenda);

                if (!authenticatedUser) {
                  _context4.next = 24;
                  break;
                }

                newSchedule = new _SearchCriteriaModel.default({
                  userId: userId,
                  executionDays: executionDays,
                  executionTime: executionTime,
                  searchText: searchText,
                  searchCity: searchCity
                });
                _context4.next = 8;
                return newSchedule.save();

              case 8:
                res = _context4.sent;

                if (!res) {
                  _context4.next = 21;
                  break;
                }

                _context4.next = 12;
                return _UserModel.default.findOne({
                  _id: userId
                });

              case 12:
                foundUser = _context4.sent;

                if (!foundUser) {
                  _context4.next = 18;
                  break;
                }

                job = _server.agenda.create("send-email-to-user", {
                  to: foundUser.email,
                  searchData: {
                    city: searchCity,
                    searchText: searchText
                  },
                  scheduleId: res._id
                });

                if (executionDays.includes("everyday")) {
                  (0, _scheduler.everyday)(job, executionTime);
                } else {
                  (0, _scheduler.certainDays)(job, executionDays, executionTime);
                }

                _context4.next = 19;
                break;

              case 18:
                return _context4.abrupt("return", new Error("Unable to find the associated user with this schedule."));

              case 19:
                _context4.next = 22;
                break;

              case 21:
                return _context4.abrupt("return", new Error("There was trouble saving this schedule. Please try again."));

              case 22:
                _context4.next = 25;
                break;

              case 24:
                throw new Error("Not authenticated");

              case 25:
                _context4.next = 30;
                break;

              case 27:
                _context4.prev = 27;
                _context4.t0 = _context4["catch"](2);
                return _context4.abrupt("return", new Error(_context4.t0));

              case 30:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[2, 27]]);
      }));

      function addSchedule(_x10, _x11, _x12) {
        return _addSchedule.apply(this, arguments);
      }

      return addSchedule;
    }(),
    editSchedule: function () {
      var _editSchedule = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(root, _ref8, _ref9) {
        var _id, executionDays, executionTime, searchText, searchCity, authenticatedUser, resultingSchedule, foundJobs, foundUser, job;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _id = _ref8._id, executionDays = _ref8.executionDays, executionTime = _ref8.executionTime, searchText = _ref8.searchText, searchCity = _ref8.searchCity;
                authenticatedUser = _ref9.authenticatedUser;
                _context5.prev = 2;

                if (!authenticatedUser) {
                  _context5.next = 26;
                  break;
                }

                _context5.next = 6;
                return _SearchCriteriaModel.default.findOneAndUpdate({
                  _id: _id
                }, {
                  $set: {
                    executionDays: executionDays,
                    executionTime: executionTime,
                    searchText: searchText,
                    searchCity: searchCity
                  }
                }).exec();

              case 6:
                resultingSchedule = _context5.sent;

                if (!resultingSchedule) {
                  _context5.next = 23;
                  break;
                }

                _context5.next = 10;
                return _server.agenda.jobs({
                  "data.scheduleId": resultingSchedule._id // already of type ObjectId

                });

              case 10:
                foundJobs = _context5.sent;

                if (foundJobs) {
                  foundJobs.forEach(function (job) {
                    job.remove();
                  });
                }

                _context5.next = 14;
                return _UserModel.default.findOne({
                  _id: resultingSchedule.userId
                });

              case 14:
                foundUser = _context5.sent;

                if (!foundUser) {
                  _context5.next = 20;
                  break;
                }

                job = _server.agenda.create("send-email-to-user", {
                  to: foundUser.email,
                  searchData: {
                    city: searchCity,
                    searchText: searchText
                  },
                  scheduleId: resultingSchedule._id
                });

                if (executionDays.includes("everyday")) {
                  (0, _scheduler.everyday)(job, executionTime);
                } else {
                  (0, _scheduler.certainDays)(job, executionDays, executionTime);
                }

                _context5.next = 21;
                break;

              case 20:
                return _context5.abrupt("return", new Error("Couldn't find user associated with schedule"));

              case 21:
                _context5.next = 24;
                break;

              case 23:
                return _context5.abrupt("return", new Error("Couldn't find corresponding schedule to update"));

              case 24:
                _context5.next = 27;
                break;

              case 26:
                return _context5.abrupt("return", new Error("Not authenticated"));

              case 27:
                _context5.next = 32;
                break;

              case 29:
                _context5.prev = 29;
                _context5.t0 = _context5["catch"](2);
                return _context5.abrupt("return", new Error(_context5.t0));

              case 32:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[2, 29]]);
      }));

      function editSchedule(_x13, _x14, _x15) {
        return _editSchedule.apply(this, arguments);
      }

      return editSchedule;
    }(),
    deleteSchedule: function () {
      var _deleteSchedule = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(root, _ref10, _ref11) {
        var _id, authenticatedUser, jobs;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _id = _ref10._id;
                authenticatedUser = _ref11.authenticatedUser;
                _context6.prev = 2;

                if (!authenticatedUser) {
                  _context6.next = 12;
                  break;
                }

                _context6.next = 6;
                return _server.agenda.jobs({
                  "data.scheduleId": _mongoose.default.Types.ObjectId(_id)
                });

              case 6:
                jobs = _context6.sent;

                if (jobs) {
                  jobs.forEach(function (job) {
                    job.remove();
                  });
                }

                _context6.next = 10;
                return _SearchCriteriaModel.default.findByIdAndRemove({
                  _id: _id
                }).exec();

              case 10:
                _context6.next = 13;
                break;

              case 12:
                return _context6.abrupt("return", new Error("Not authenticated"));

              case 13:
                _context6.next = 18;
                break;

              case 15:
                _context6.prev = 15;
                _context6.t0 = _context6["catch"](2);
                throw new Error(_context6.t0);

              case 18:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[2, 15]]);
      }));

      function deleteSchedule(_x16, _x17, _x18) {
        return _deleteSchedule.apply(this, arguments);
      }

      return deleteSchedule;
    }()
  }
};
exports.default = _default;
//# sourceMappingURL=index.js.map