import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import User from "../../../models/UserModel";
import secret from "../../../../jwtAuth";

export default {
  Query: {
    user: async (root, { email, password }) => {
      try {
        const foundUser = await User.findOne({ email }).exec();
        if (foundUser) {
          const valid = bcrypt.compare(password, foundUser.password);
          if (valid) {
            return JSON.stringify({
              userId: foundUser._id,
              email: foundUser.email,
              JWT_TOKEN: jsonwebtoken.sign(
                { id: foundUser._id, email: foundUser.email },
                secret,
                { expiresIn: "1d" }
              )
            });
          } else {
            throw new Error("Incorrect email or password");
          }
        } else {
          throw new Error("Cannot find a user with this email address");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    users: async (root, args, { authenticatedUser }) => {
      try {
        if (authenticatedUser) {
          const users = await User.find({})
            .populate()
            .exec();
          return users;
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    addUser: async (root, { email, password }) => {
      try {
        const hash = await bcrypt.hash(password, 10);
        password = hash;
        const newUser = new User({ email, password });
        const result = await newUser.save();
        if (result) {
          return JSON.stringify({
            userId: result._id,
            email: result.email,
            JWT_TOKEN: jsonwebtoken.sign(
              { id: result._id, email: result.email },
              secret,
              { expiresIn: "1d" }
            )
          });
        } else {
          throw new Error("Problem registering. Please try again.");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    editUser: async (root, { id, email, password }, { authenticatedUser }) => {
      try {
        if (authenticatedUser) {
          const user = await User.findOneAndUpdate(
            { id },
            { $set: { email, password } }
          ).exec();
          if (user) {
            return user;
          } else {
            throw new Error("Couldn't find associated user");
          }
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    deleteUser: async (root, { id }, { authenticatedUser }) => {
      try {
        if (authenticatedUser) {
          const user = await User.findByIdAndRemove({ _id: id }).exec();
          return user;
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};
