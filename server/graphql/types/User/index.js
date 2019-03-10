export default `
type User {
    _id: ID!
    email: String!
    password: String!
}

type Query {
    user(email: String!, password: String!): String
    users: [User]
}

type Mutation{
    addUser(email: String!, password: String!): String
    editUser(_id: ID!, email: String, password: String): String
    deleteUser(_id:ID!): User
}
`;
