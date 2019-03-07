import gql from "graphql-tag";

export const EditSchedule = gql`
  mutation EditSchedule(
    $scheduleId: ID!
    $executionDays: [String]!
    $executionTime: String!
    $searchText: String!
    $searchCity: String!
  ) {
    editSchedule(
      _id: $scheduleId
      executionDays: $executionDays
      executionTime: $executionTime
      searchText: $searchText
      searchCity: $searchCity
    ) {
      executionDays
      executionTime
      searchText
      searchCity
    }
  }
`;

export const AddSchedule = gql`
  mutation AddSchedule(
    $userId: ID!
    $executionDays: [String]!
    $executionTime: String!
    $searchText: String!
    $searchCity: String!
  ) {
    addSchedule(
      userId: $userId
      executionDays: $executionDays
      executionTime: $executionTime
      searchText: $searchText
      searchCity: $searchCity
    ) {
      userId
    }
  }
`;

export const DeleteSchedule = gql`
  mutation DeleteScheduled($id: ID!) {
    deleteSchedule(_id: $id) {
      _id
    }
  }
`;
