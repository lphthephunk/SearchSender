module.exports = `
    type Schedule {
        _id: ID!
        executionTime: String!
        executionDays: [String]!
        userId: ID!
        searchText: String!
        searchCity: String!
    }

    type City{
        cityName: String!
        ref: String!
    }

    type Query {
        schedule(userId: ID!, executionDay: String!): Schedule
        schedules(userId: ID!): [Schedule]
        getCities: [City]
    }

    type Mutation {
        addSchedule(userId: ID!, executionDays: [String]!, executionTime: String!, searchText: String!, searchCity: String!): Schedule
        editSchedule(_id: ID!, executionDays: [String], executionTime: String, searchText: String, searchCity: String!): Schedule
        deleteSchedule(_id: ID!): Schedule
    }
`;
