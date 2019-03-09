import gql from "graphql-tag";

export const Users = gql`
  {
    users {
      email
    }
  }
`;

export const FetchUser = gql`
  query FetchUser($email: String!, $password: String!) {
    user(email: $email, password: $password)
  }
`;
