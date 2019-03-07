import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";
import { DeleteOutlined, Add } from "@material-ui/icons";

import client from "../../apolloClient";
import useHistory from "../../hooks/useHistory";
import { UserStateContext } from "../../utils/UserStateProvider";
import "../styles/HomePage.css";
import { GetSchedules } from "../../graphql/search/queries";
import { DeleteSchedule } from "../../graphql/search/mutations";
import {
  twentyFourHourToTwelveHour,
  formatDaysList
} from "../../utils/TimeFormatter";

export default function HomePage() {
  const { history } = useHistory();
  const [schedules, setSchedules] = useState([]);
  const [retrievalError, setRetrievalError] = useState("");
  const [deletionError, setDeletionError] = useState("");
  const userId = useContext(UserStateContext);

  useEffect(() => {
    client
      .query({
        variables: { id: userId },
        query: GetSchedules,
        fetchPolicy: "network-only"
      })
      .then(value => {
        setSchedules(value.data.schedules);
      })
      .catch(err => {
        if (err.graphQLErrors && err.graphQLErrors.length > 0) {
          console.error(err.graphQLErrors[0]);
          setRetrievalError(err.graphQLErrors[0].message);
        } else {
          setRetrievalError(
            "Oops, there was some trouble getting the schedules from the server. Try refreshing the page."
          );
        }
      })
      .finally(() => {});
  }, []);

  const handleDeleteSchedule = scheduleId => {
    client
      .mutate({
        variables: { id: scheduleId },
        mutation: DeleteSchedule
      })
      .then(value => {
        // remove value from state so we don't have to make another hit to the server
        const updatedSchedules = schedules.filter(
          schedule => schedule._id !== scheduleId
        );
        setSchedules(updatedSchedules);
      })
      .catch(err => {
        if (err.graphQLErrors && err.graphQLErrors.length > 0) {
          console.error(err.graphQLErrors[0]);
          setDeletionError(err.graphQLErrors[0].message);
        } else {
          setDeletionError(
            "Oops, there was some trouble when attempting to delete this schedule. Try refreshing your page and deleting it again."
          );
        }
      })
      .finally(() => {});
  };

  return (
    <div>
      <div id="main-view-button-container">
        <div id="schedule-container">
          <Paper
            id="paper"
            style={{ width: "fit-content", borderRadius: "100%" }}
          >
            <Button
              variant="contained"
              color="primary"
              style={{
                minWidth: "100px",
                minHeight: "100px",
                borderRadius: "100%"
              }}
              onClick={() => history.push("/schedules/add")}
            >
              <Add />
            </Button>
          </Paper>
        </div>
      </div>
      <Paper id="list-paper">
        {retrievalError !== "" && (
          <Typography style={{ color: "red" }} component="p">
            {retrievalError}
          </Typography>
        )}
        {deletionError !== "" && (
          <Typography style={{ color: "red" }} component="p">
            {deletionError}
          </Typography>
        )}
        <Table id="schedule-table">
          <TableHead>
            <TableRow>
              <TableCell>Schedules</TableCell>
              <TableCell align="right">Execution Time</TableCell>
              <TableCell align="right">Scheduled Days</TableCell>
              <TableCell align="right">Search Location</TableCell>
              <TableCell align="right">Search Criteria</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ overflowX: "auto" }}>
            {schedules.map(
              ({
                _id,
                executionTime,
                executionDays,
                searchText,
                searchCity
              }) => {
                return (
                  <TableRow key={_id}>
                    <TableCell align="left">
                      <DeleteOutlined
                        className="garbage-can"
                        onClick={() => handleDeleteSchedule(_id)}
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={() =>
                        history.push({
                          pathname: `/schedules/edit/${_id}`,
                          state: {
                            executionTime,
                            executionDays,
                            searchText,
                            searchCity
                          }
                        })
                      }
                      className="clickable"
                    >
                      {twentyFourHourToTwelveHour(executionTime)}
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={() =>
                        history.push({
                          pathname: `/schedules/edit/${_id}`,
                          state: {
                            executionTime,
                            executionDays,
                            searchText,
                            searchCity
                          }
                        })
                      }
                      className="clickable"
                    >
                      {formatDaysList(executionDays)}
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={() =>
                        history.push({
                          pathname: `/schedules/edit/${_id}`,
                          state: {
                            executionTime,
                            executionDays,
                            searchText,
                            searchCity
                          }
                        })
                      }
                      className="clickable"
                    >
                      {searchCity}
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={() =>
                        history.push({
                          pathname: `/schedules/edit/${_id}`,
                          state: {
                            executionTime,
                            executionDays,
                            searchText,
                            searchCity
                          }
                        })
                      }
                      className="clickable"
                    >
                      {searchText}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
