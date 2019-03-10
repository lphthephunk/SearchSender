"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mergeGraphqlSchemas = require("merge-graphql-schemas");

var _User = _interopRequireDefault(require("./User"));

var _Search = _interopRequireDefault(require("./Search"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _mergeGraphqlSchemas.mergeResolvers)([_User.default, _Search.default]);

exports.default = _default;
//# sourceMappingURL=index.js.map