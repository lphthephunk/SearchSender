import gql from "graphql-tag";

export const AddUser = gql`
  mutation AddUser($email: String!, $password: String!) {
    addUser(email: $email, password: $password)
  }
`;
