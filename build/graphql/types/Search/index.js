"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "\n    type Schedule {\n        _id: ID!\n        executionTime: String!\n        executionDays: [String]!\n        userId: ID!\n        searchText: String!\n        searchCity: String!\n    }\n\n    type City{\n        cityName: String!\n        ref: String!\n    }\n\n    type Query {\n        schedule(userId: ID!, executionDay: String!): Schedule\n        schedules(userId: ID!): [Schedule]\n        getCities: [City]\n    }\n\n    type Mutation {\n        addSchedule(userId: ID!, executionDays: [String]!, executionTime: String!, searchText: String!, searchCity: String!): Schedule\n        editSchedule(_id: ID!, executionDays: [String], executionTime: String, searchText: String, searchCity: String!): Schedule\n        deleteSchedule(_id: ID!): Schedule\n    }\n";
exports.default = _default;
//# sourceMappingURL=index.js.map