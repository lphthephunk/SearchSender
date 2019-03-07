import gql from "graphql-tag";

export const GetSchedules = gql`
  query GetSchedules($id: ID!) {
    schedules(userId: $id) {
      _id
      searchText
      executionDays
      executionTime
      searchCity
    }
  }
`;

export const GetCities = gql`
  {
    getCities {
      cityName
      ref
    }
  }
`;
