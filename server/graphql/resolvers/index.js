import { mergeResolvers } from "merge-graphql-schemas";

import userResolver from "./User";
import searchResolver from "./Search";

export default mergeResolvers([userResolver, searchResolver]);
