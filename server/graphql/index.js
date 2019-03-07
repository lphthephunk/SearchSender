const makeExecutableSchema = require("graphql-tools").makeExecutableSchema;

import typeDefs from "./types";
import resolvers from "./resolvers";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = schema;
