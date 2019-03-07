export default `
type User {
    _id: ID!
    email: String!
    password: String!
}

type Query {
    user(email: String!, password: String!): User
    users: [User]
}

type Mutation{
    addUser(email: String!, password: String!): User
    editUser(_id: ID!, email: String, password: String): User
    deleteUser(_id:ID!): User
}
`;
