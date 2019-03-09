import React, { useState, useContext, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Typography,
  Paper,
  Checkbox,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Select,
  MenuItem
} from "@material-ui/core";

import TimeInput from "material-ui-time-picker";

import "../styles/ManageSchedulePage.css";
import ConfirmationPopup from "../ConfirmationPopup";
import useHistory from "../../hooks/useHistory";
import { client } from "../../apolloClient";
import { UserStateContext } from "../../utils/UserStateProvider";
import { AddSchedule, EditSchedule } from "../../graphql/search/mutations";
import { GetSchedules, GetCities } from "../../graphql/search/queries";
import { twentyFourHourToTwelveHour } from "../../utils/TimeFormatter";

export default function ManageSchedulePage(props) {
  const [scheduleId, setScheduleId] = useState("");
  const [criteria, setCriteria] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const tempDate = new Date();
  const hours = tempDate.getHours();
  let minutes = tempDate.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  const [selectedTime, setSelectedTime] = useState(
    hours.toString().concat(":", minutes.toString())
  );
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [errSearchCriteria, setErrSearchCriteria] = useState("");
  const [errCheckboxes, setErrCheckboxes] = useState("");
  const [errTime, setErrTime] = useState("");
  const [errSelectedCity, setErrSelectedCity] = useState("");
  const { history } = useHistory();
  const [serverError, setServerError] = useState("");
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [availableCities, setAvailableCities] = useState([]);

  const { userId } = useContext(UserStateContext);

  const appolloClient = client();

  // attempt to dump initial state into the fields if we are coming here to edit
  useEffect(() => {
    if (props.match.params && props.location.state) {
      try {
        setIsInEditMode(true);
        setScheduleId(props.match.params.scheduleId);
        setCriteria(props.location.state.searchText.toString());
        setSelectedDays(props.location.state.executionDays);
        setSelectedTime(props.location.state.executionTime);
        setSelectedCity(props.location.state.searchCity);
      } catch (err) {
        console.error(err);
      }
    }

    // fetch craigslist cities for select control
    appolloClient
      .query({
        query: GetCities,
        fetchPolicy: "cache-first"
      })
      .then(result => {
        const cities = [];
        result.data.getCities.map(({ cityName, ref }) => {
          return cities.push({ cityName, ref });
        });
        setAvailableCities(cities);
      })
      .catch(err => {
        if (err.graphQLErrors && err.graphQLErrors.length > 0) {
          console.error(err.graphQLErrors[0]);
          setServerError(err.graphQLErrors[0].message);
        } else {
          console.error(err);
          setServerError("Unable to retrieve cities");
        }
      });
  }, []);

  const handleSubmitSearchCriteria = e => {
    e.preventDefault();
    let isValid = true;
    if (criteria === "") {
      setErrSearchCriteria("Search criteria cannot be empty");
      isValid = false;
    }
    if (selectedDays.length === 0) {
      setErrCheckboxes("One or more days must be selected");
      isValid = false;
    }
    if (selectedTime === "") {
      setErrTime("A time must be selected");
      isValid = false;
    }
    if (selectedCity === "") {
      setErrSelectedCity("A city must be selected");
    }

    if (isValid) {
      setShowConfirmationPopup(true);
    } else {
      return;
    }
  };

  const updateSelectedDays = currentSelectedDay => {
    let newArr = [];
    if (currentSelectedDay === "everyday") {
      if (selectedDays.includes("everyday")) {
        return newArr;
      } else {
        newArr.push("everyday");
        return newArr;
      }
    }

    if (selectedDays.includes(currentSelectedDay)) {
      // remove it since we are trying to "uncheck" this day
      selectedDays
        .filter(x => x !== currentSelectedDay)
        .forEach(day => {
          newArr.push(day);
        });
    } else {
      // add it since we are trying to "check" this day
      newArr = selectedDays;
      newArr.push(currentSelectedDay);
    }

    return newArr;
  };

  const renderCheckBoxesForEverydayState = () => {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];
    return daysOfWeek.map((day, index) => {
      return (
        <FormControlLabel
          key={index}
          label={day}
          control={<Checkbox disabled={true} checked={false} />}
        />
      );
    });
  };

  const handleConfirmation = async () => {
    // send the schedule to the server
    let isSuccess = false;
    let selectedMutation = isInEditMode ? EditSchedule : AddSchedule;
    let variables = {
      executionDays: selectedDays,
      executionTime: selectedTime.replace(":", ""),
      searchText: criteria,
      searchCity: selectedCity
    };

    if (isInEditMode) {
      variables["scheduleId"] = scheduleId;
    } else {
      variables["userId"] = userId;
    }

    await appolloClient
      .mutate({
        variables,
        mutation: selectedMutation,
        refetchQueries: [
          {
            query: GetSchedules,
            variables: { id: userId }
          }
        ]
      })
      .then(value => {
        isSuccess = true;
      })
      .catch(err => {
        if (err.graphQLErrors && err.graphQLErrors.length > 0) {
          console.error(err.graphQLErrors[0]);
          setServerError(err.graphQLErrors[0].message);
        } else {
          console.error(err);
          setServerError(
            "An unknown error occurred. Please wait and try submitting the schedule again."
          );
        }
      })
      .finally(() => {
        setShowConfirmationPopup(false);
        if (isSuccess) {
          history.push("/");
        }
      });
  };

  const setDefaultChecked = day => {
    try {
      if (props.location.state) {
        return props.location.state.executionDays.includes(day);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setDefaultTime = () => {
    try {
      if (props.location.state && props.location.state.executionTime) {
        const hours = props.location.state.executionTime.slice(0, 2);
        const minutes = props.location.state.executionTime.slice(2);
        let returnDate = new Date();
        returnDate.setHours(hours);
        returnDate.setMinutes(minutes);
        return returnDate;
      } else {
        return new Date();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {showConfirmationPopup && (
        <ConfirmationPopup
          handleSubmit={handleConfirmation}
          handleCancel={() => setShowConfirmationPopup(false)}
          submitBtnText="Yes"
          cancelBtnText="No"
          message={
            isInEditMode
              ? `You are attempting to update this schedule so that it will be run ${
                  !selectedDays.includes("everyday") ? "every " : ""
                } ${selectedDays} at ${twentyFourHourToTwelveHour(
                  selectedTime
                )}. Would you like to continue?`
              : `You are attempting to make a schedule that is run ${
                  !selectedDays.includes("everyday") ? "every " : ""
                } ${selectedDays} at ${twentyFourHourToTwelveHour(
                  selectedTime
                )}. Would you like to proceed?`
          }
        />
      )}
      <Paper id="add-schedule-container">
        <Typography component="h3" variant="h4">
          Enter Search Criteria
        </Typography>
        <form onSubmit={handleSubmitSearchCriteria}>
          <FormControl margin="normal" fullWidth>
            <InputLabel>What would you like to search for?</InputLabel>
            <Input
              type="text"
              value={criteria}
              onChange={event => {
                setCriteria(event.target.value);
                if (event.target.value !== "") {
                  setErrSearchCriteria("");
                }
              }}
            />
            {errSearchCriteria !== "" && (
              <Typography component="p" style={{ color: "red" }}>
                {errSearchCriteria}
              </Typography>
            )}
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <InputLabel htmlFor="city-select">
              Select neareast major city
            </InputLabel>
            <Select
              input={<Input name="city" id="city-select" />}
              value={selectedCity}
              onChange={event => {
                setSelectedCity(event.target.value);
                if (event.target.value !== "") {
                  setErrSelectedCity("");
                }
              }}
              displayEmpty
            >
              {availableCities.map(({ cityName, ref }, index) => {
                return (
                  <MenuItem key={index} value={ref}>
                    {cityName}
                  </MenuItem>
                );
              })}
            </Select>
            {errSelectedCity !== "" && (
              <Typography style={{ color: "red" }} component="p">
                {errSelectedCity}
              </Typography>
            )}
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <FormLabel component="legend">
              Which days would you like to receive emails?
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                label="Everyday"
                control={
                  <Checkbox
                    onChange={() => {
                      setSelectedDays(updateSelectedDays("everyday"));
                      setErrCheckboxes("");
                    }}
                    defaultChecked={setDefaultChecked("everyday")}
                  />
                }
              />
              {selectedDays[0] === "everyday" ? (
                <div>{renderCheckBoxesForEverydayState()} </div>
              ) : (
                <div>
                  <FormControlLabel
                    label="Monday"
                    control={
                      <Checkbox
                        onChange={() => {
                          setSelectedDays(updateSelectedDays("monday"));
                          setErrCheckboxes("");
                        }}
                        defaultChecked={setDefaultChecked("monday")}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Tuesday"
                    control={
                      <Checkbox
                        onChange={() => {
                          setSelectedDays(updateSelectedDays("tuesday"));
                          setErrCheckboxes("");
                        }}
                        defaultChecked={setDefaultChecked("tuesday")}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Wednesday"
                    control={
                      <Checkbox
                        onChange={() => {
                          setSelectedDays(updateSelectedDays("wednesday"));
                          setErrCheckboxes("");
                        }}
                        defaultChecked={setDefaultChecked("wednesday")}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Thursday"
                    control={
                      <Checkbox
                        onChange={() => {
                          setSelectedDays(updateSelectedDays("thursday"));
                          setErrCheckboxes("");
                        }}
                        defaultChecked={setDefaultChecked("thursday")}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Friday"
                    control={
                      <Checkbox
                        onChange={() => {
                          setSelectedDays(updateSelectedDays("friday"));
                          setErrCheckboxes("");
                        }}
                        defaultChecked={setDefaultChecked("friday")}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Saturday"
                    control={
                      <Checkbox
                        onChange={() => {
                          setSelectedDays(updateSelectedDays("saturday"));
                          setErrCheckboxes("");
                        }}
                        defaultChecked={setDefaultChecked("saturday")}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Sunday"
                    control={
                      <Checkbox
                        onChange={() => {
                          setSelectedDays(updateSelectedDays("sunday"));
                          setErrCheckboxes("");
                        }}
                        defaultChecked={setDefaultChecked("sunday")}
                      />
                    }
                  />
                </div>
              )}
            </FormGroup>
            {errCheckboxes !== "" && (
              <Typography component="p" style={{ color: "red" }}>
                {errCheckboxes}
              </Typography>
            )}
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <InputLabel>
              At what time would you like to receive the email?
            </InputLabel>
            <TimeInput
              initialTime={setDefaultTime()}
              mode="12h"
              onChange={time => {
                if (time) {
                  let hours = time.getHours();
                  if (hours === 0) {
                    hours = 12;
                  }
                  let minutes = time.getMinutes();
                  if (minutes < 10) {
                    minutes = "0" + minutes;
                  }
                  setSelectedTime(
                    hours.toString().concat(":", minutes.toString())
                  );
                  setErrTime("");
                }
              }}
            />
            {errTime !== "" && (
              <Typography component="p" style={{ color: "red" }}>
                {errTime}
              </Typography>
            )}
          </FormControl>
          {serverError !== "" && (
            <Typography style={{ color: "red" }} component="p">
              {serverError}
            </Typography>
          )}
          <Button type="submit" color="primary">
            {isInEditMode ? "Submit Changes to Schedule" : "Submit"}
          </Button>
        </form>
      </Paper>
    </div>
  );
}
