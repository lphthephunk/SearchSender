import { mergeTypes } from "merge-graphql-schemas";

import User from "./User";
import Schedule from "./Search";

const typeDefs = [User, Schedule];

export default mergeTypes(typeDefs, { all: true });
