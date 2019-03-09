import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";

export const client = () => {
  const serverPort = process.env.PORT || "4000";
  const httpLink = createHttpLink({
    uri: `http://localhost:${serverPort}`
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("JWT_TOKEN");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
      }
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
};
