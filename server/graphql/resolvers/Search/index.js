import Schedule from "../../../models/SearchCriteriaModel";
import User from "../../../models/UserModel";
import { agenda } from "../../../../server";
import { everyday, certainDays } from "../../../utils/agenda/scheduler";
import GetCities from "../../../external/craigslist/getCities";
import mongoose from "mongoose";

export default {
  Query: {
    schedule: async (root, { userId, executionDay }, { authenticatedUser }) => {
      try {
        if (authenticatedUser) {
          const schedule = await Schedule.findOne({
            userId,
            executionDay
          }).exec();
          if (schedule) {
            return schedule;
          } else {
            throw new Error("Could not find an associated schedule.");
          }
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    schedules: async (root, { userId }, { authenticatedUser }) => {
      try {
        if (authenticatedUser) {
          const schedules = await Schedule.find({ userId })
            .populate()
            .exec();
          if (schedules) {
            return schedules;
          }
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    getCities: async (root, args, { authenticatedUser }) => {
      try {
        if (authenticatedUser) {
          const cities = await GetCities();
          return cities;
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    addSchedule: async (
      root,
      { userId, executionDays, executionTime, searchText, searchCity },
      { authenticatedUser }
    ) => {
      try {
        console.log("wtf: ", agenda.agenda);
        if (authenticatedUser) {
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
              return new Error(
                "Unable to find the associated user with this schedule."
              );
            }
          } else {
            return new Error(
              "There was trouble saving this schedule. Please try again."
            );
          }
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        return new Error(err);
      }
    },
    editSchedule: async (
      root,
      { _id, executionDays, executionTime, searchText, searchCity },
      { authenticatedUser }
    ) => {
      try {
        if (authenticatedUser) {
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
              return new Error("Couldn't find user associated with schedule");
            }
          } else {
            return new Error("Couldn't find corresponding schedule to update");
          }
        } else {
          return new Error("Not authenticated");
        }
      } catch (err) {
        return new Error(err);
      }
    },
    deleteSchedule: async (root, { _id }, { authenticatedUser }) => {
      try {
        if (authenticatedUser) {
          const jobs = await agenda.jobs({
            "data.scheduleId": mongoose.Types.ObjectId(_id)
          });
          if (jobs) {
            jobs.forEach(job => {
              job.remove();
            });
          }
          await Schedule.findByIdAndRemove({ _id }).exec();
        } else {
          return new Error("Not authenticated");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};
