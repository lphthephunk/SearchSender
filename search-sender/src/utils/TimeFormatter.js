export const twentyFourHourToTwelveHour = time => {
  let hours = "";
  let minutes = "";
  // first determine if this time even needs formatting
  if (time.includes(":")) {
    const parsedTime = time.split(":");
    hours = parsedTime[0];
    minutes = parsedTime[1];
  } else {
    hours = time.slice(0, 2);
    minutes = time.slice(2);
  }

  if (Number(hours) < 13) {
    if (hours < 10) {
      hours = "0" + hours;
    }
    return hours.toString().concat(":", minutes, " AM");
  } else {
    hours = Number(hours) - 12;
    return hours.toString().concat(":", minutes, " PM");
  }
};

export const formatDaysList = days => {
  // first assign a numerical value to the days for ease or sorting
  let dayValuePair = [];

  days.forEach(day => {
    if (day === "monday") {
      dayValuePair.push({ day, index: 1 });
    } else if (day === "tuesday") {
      dayValuePair.push({ day, index: 2 });
    } else if (day === "wednesday") {
      dayValuePair.push({ day, index: 3 });
    } else if (day === "thursday") {
      dayValuePair.push({ day, index: 4 });
    } else if (day === "friday") {
      dayValuePair.push({ day, index: 5 });
    } else if (day === "saturday") {
      dayValuePair.push({ day, index: 6 });
    } else if (day === "sunday") {
      dayValuePair.push({ day, index: 7 });
    } else if (day === "everyday") {
      dayValuePair.push({ day, index: 0 });
    }
  });

  dayValuePair = dayValuePair
    .sort((a, b) => {
      if (a.index > b.index) {
        return 1;
      } else {
        return -1;
      }
    })
    .map((value, index) => {
      return (dayValuePair[index] = value.day);
    });

  return dayValuePair.join(", ");
};
