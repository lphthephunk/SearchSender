import Schedule from "../../../models/SearchCriteriaModel";
import User from "../../../models/UserModel";
import { agenda } from "../../../server";
import { everyday, certainDays } from "../../../utils/agenda/scheduler";
import GetCities from "../../../external/craigslist/getCities";
import mongoose from "mongoose";

export default {
  Query: {
    schedule: (root, { userId, executionDay }) => {
      return new Promise((resolve, reject) => {
        Schedule.findOne({ userId, executionDay }).exec((err, res) => {
          if (err) {
            reject(err);
          }

          if (res) {
            resolve(res);
          } else {
            reject(
              `Couldn't find a schedule for this user on the given day: ${executionDay}`
            );
          }
        });
      });
    },
    schedules: (root, { userId }) => {
      return new Promise((resolve, reject) => {
        Schedule.find({ userId })
          .populate()
          .exec((err, res) => {
            if (err) {
              reject(err);
            }

            if (res) {
              resolve(res);
            } else {
              reject("There are no schedules to retrieve");
            }
          });
      });
    },
    getCities: async (root, args) => {
      try {
        const cities = await GetCities();
        return cities;
      } catch (err) {
        throw err;
      }
    }
  },
  Mutation: {
    addSchedule: async (
      root,
      { userId, executionDays, executionTime, searchText, searchCity }
    ) => {
      try {
        const newSchedule = new Schedule({
          userId,
          executionDays,
          executionTime,
          searchText,
          searchCity
        });
        const res = await newSchedule.save();
        if (res) {
          const foundUser = await User.findOne({ _id: userId });
          if (foundUser) {
            const job = agenda.create("send-email-to-user", {
              to: foundUser.email,
              searchData: { city: searchCity, searchText },
              scheduleId: res._id
            });

            if (executionDays.includes("everyday")) {
              everyday(job, executionTime);
            } else {
              certainDays(job, executionDays, executionTime);
            }
          } else {
            throw "Unable to find the associated user with this schedule.";
          }
        } else {
          throw "There was trouble saving this schedule. Please try again.";
        }
      } catch (err) {
        throw err;
      }
    },
    editSchedule: async (
      root,
      { _id, executionDays, executionTime, searchText, searchCity }
    ) => {
      try {
        const resultingSchedule = await Schedule.findOneAndUpdate(
          { _id },
          { $set: { executionDays, executionTime, searchText, searchCity } }
        ).exec();
        if (resultingSchedule) {
          // kill the jobs associated with this schedule so that we can make more with the updated data
          const foundJobs = await agenda.jobs({
            "data.scheduleId": resultingSchedule._id // already of type ObjectId
          });
          if (foundJobs) {
            foundJobs.forEach(job => {
              job.remove();
            });
          }

          const foundUser = await User.findOne({
            _id: resultingSchedule.userId
          });

          if (foundUser) {
            console.log("email: ", foundUser.email);
            const job = agenda.create("send-email-to-user", {
              to: foundUser.email,
              searchData: { city: searchCity, searchText },
              scheduleId: resultingSchedule._id
            });

            if (executionDays.includes("everyday")) {
              everyday(job, executionTime);
            } else {
              certainDays(job, executionDays, executionTime);
            }
          } else {
            throw "Couldn't find user associated with schedule";
          }
        } else {
          throw "Couldn't find corresponding schedule to update";
        }
      } catch (err) {
        throw err;
      }
    },
    deleteSchedule: async (root, { _id }) => {
      try {
        const jobs = await agenda.jobs({
          "data.scheduleId": mongoose.Types.ObjectId(_id)
        });
        if (jobs) {
          jobs.forEach(job => {
            job.remove();
          });
        }
        await Schedule.findByIdAndRemove({ _id }).exec();
      } catch (err) {
        throw err;
      }
    }
  }
};
