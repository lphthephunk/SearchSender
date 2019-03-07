import bcrypt from "bcrypt";
import User from "../../../models/UserModel";

export default {
  Query: {
    user: (root, { email, password }) => {
      return new Promise((resolve, reject) => {
        User.findOne({ email }).exec((err, res) => {
          if (err) {
            reject(err);
          }

          if (res) {
            bcrypt.compare(password, res.password, (compareErr, compareRes) => {
              if (compareErr) {
                reject(compareErr);
              }

              if (compareRes) {
                resolve(res);
              } else {
                reject("Incorrect Username or Password");
              }
            });
          } else {
            reject("Cannot find a user with this email address");
          }
        });
      });
    },
    users: () => {
      return new Promise((resolve, reject) => {
        User.find({})
          .populate()
          .exec((err, res) => {
            err ? reject(err) : resolve(res);
          });
      });
    }
  },
  Mutation: {
    addUser: async (root, { email, password }) => {
      const hash = await bcrypt.hash(password, 10);
      password = hash;
      const newUser = new User({ email, password });
      return new Promise((resolve, reject) => {
        newUser.save((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    editUser: (root, { id, email, password }) => {
      return new Promise((resolve, reject) => {
        User.findOneAndUpdate({ id }, { $set: { email, password } }).exec(
          (err, res) => {
            err ? reject(err) : resolve(res);
          }
        );
      });
    },
    deleteUser: (root, { id }) => {
      return new Promise((resolve, reject) => {
        User.findByIdAndRemove({ _id: id }).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    }
  }
};
