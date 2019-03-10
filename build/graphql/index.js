"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphqlTools = require("graphql-tools");

var _types = _interopRequireDefault(require("./types"));

var _resolvers = _interopRequireDefault(require("./resolvers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: _types.default,
  resolvers: _resolvers.default
});

exports.default = _default;
//# sourceMappingURL=index.js.map