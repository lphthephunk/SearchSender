const mergeResolvers = require("merge-graphql-schemas").mergeResolvers;

const userResolver = require("./User");
const searchResolver = require("./Search");

module.exports = mergeResolvers([userResolver, searchResolver]);
