const mergeTypes = require("merge-graphql-schemas").mergeTypes;

const User = require("./User");
const Schedule = require("./Search");

const typeDefs = [User, Schedule];

module.exports = mergeTypes(typeDefs, { all: true });
