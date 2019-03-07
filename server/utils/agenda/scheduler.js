export const everyday = (job, time) => {
  // assuming time is always in 24 hour format and no special characters
  const hours = time.slice(0, 2);
  const minutes = time.slice(2);

  job.repeatEvery(`${Number(minutes).toString()} ${hours.toString()} * * *`, {
    skipImmediate: true
  });
  job.save();
};

export const certainDays = (job, days, time) => {
  // assuming time is always in 24 hour format and no special characters
  const hours = time.slice(0, 2);
  const minutes = time.slice(2);
  const formattedDays = [];
  days.map(day => {
    if (day === "monday") {
      formattedDays.push(1);
    } else if (day === "tuesday") {
      formattedDays.push(2);
    } else if (day === "wednesday") {
      formattedDays.push(3);
    } else if (day === "thursday") {
      formattedDays.push(4);
    } else if (day === "friday") {
      formattedDays.push(5);
    } else if (day === "saturday") {
      formattedDays.push(6);
    } else if (day === "sunday") {
      formattedDays.push(0);
    }
  });

  job.repeatEvery(
    `${Number(minutes).toString()} ${hours.toString()} * * ${formattedDays.join(
      ","
    )}`,
    { skipImmediate: true }
  );
  job.save();
};
