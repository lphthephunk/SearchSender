"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "\ntype User {\n    _id: ID!\n    email: String!\n    password: String!\n}\n\ntype Query {\n    user(email: String!, password: String!): String\n    users: [User]\n}\n\ntype Mutation{\n    addUser(email: String!, password: String!): String\n    editUser(_id: ID!, email: String, password: String): String\n    deleteUser(_id:ID!): User\n}\n";
exports.default = _default;
//# sourceMappingURL=index.js.map