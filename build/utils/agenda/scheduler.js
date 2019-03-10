"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.certainDays = exports.everyday = void 0;

var everyday = function everyday(job, time) {
  // assuming time is always in 24 hour format and no special characters
  var hours = time.slice(0, 2);
  var minutes = time.slice(2);
  job.repeatEvery("".concat(Number(minutes).toString(), " ").concat(hours.toString(), " * * *"), {
    skipImmediate: true
  });
  job.save();
};

exports.everyday = everyday;

var certainDays = function certainDays(job, days, time) {
  // assuming time is always in 24 hour format and no special characters
  var hours = time.slice(0, 2);
  var minutes = time.slice(2);
  var formattedDays = [];
  days.map(function (day) {
    if (day === "monday") {
      formattedDays.push(1);
    } else if (day === "tuesday") {
      formattedDays.push(2);
    } else if (day === "wednesday") {
      formattedDays.push(3);
    } else if (day === "thursday") {
      formattedDays.push(4);
    } else if (day === "friday") {
      formattedDays.push(5);
    } else if (day === "saturday") {
      formattedDays.push(6);
    } else if (day === "sunday") {
      formattedDays.push(0);
    }
  });
  job.repeatEvery("".concat(Number(minutes).toString(), " ").concat(hours.toString(), " * * ").concat(formattedDays.join(",")), {
    skipImmediate: true
  });
  job.save();
};

exports.certainDays = certainDays;
//# sourceMappingURL=scheduler.js.map