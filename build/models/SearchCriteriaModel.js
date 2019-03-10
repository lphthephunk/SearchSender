"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose.default.Schema;
var SearchCriteriaSchema = new Schema({
  executionTime: {
    type: String,
    required: true
  },
  searchText: {
    type: String,
    required: true
  },
  executionDays: {
    type: [String],
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  searchCity: {
    type: String,
    required: true
  }
});

var SearchCriteria = _mongoose.default.model("SearchCriteria", SearchCriteriaSchema);

var _default = SearchCriteria;
exports.default = _default;
//# sourceMappingURL=SearchCriteriaModel.js.map