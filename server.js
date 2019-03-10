import express from "express";
import mongoose from "mongoose";
import expressGraphQL from "express-graphql";
import bodyParser from "body-parser";
import schema from "./server/graphql";
import cors from "cors";
import Agenda from "agenda";
import jwt from "express-jwt";
import { sendMessage } from "./server/utils/Nodemailer";
import { searchCraigslist } from "./server/utils/craigslist/postRetriever";
import path from "path";
import secret from "./jwtAuth";

require("dotenv").config();

const app = express();

let mongURI =
  "mongodb://heroku_f6rz86m0:tu34o9kicmn3hbaulrt4unt792@ds255740.mlab.com:55740/heroku_f6rz86m0";
//let mongURI = "mongodb://localhost:27017/SearchSender";
export const agenda = new Agenda();

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose
  .connect(mongURI)
  .then(() => {
    console.log("MongoDB connected");
    agenda.mongo(mongoose.connection, "jobs", () => {
      agenda.start().then(() => {
        console.log("Agenda initialized");
        agenda.processEvery("30 seconds");
        console.log("Agenda pulling jobs every 30 seconds");

        agenda.define(
          "send-email-to-user",
          { priority: "high" },
          (job, done) => {
            try {
              (async () => {
                const { to, searchData } = job.attrs.data;
                let message = "";
                const posts = await searchCraigslist(
                  searchData.city,
                  searchData.searchText,
                  "sss",
                  true,
                  false
                );
                console.log(posts);
                if (!posts) {
                  message = `There were no posts matching "${
                    searchData.searchText
                  }" today.`;
                } else {
                  posts.forEach(post => {
                    message = message.concat(post, "<br/><br/>");
                  });
                }
                await sendMessage(to, message, searchData.searchText);
                done();
              })().then(done, done);
            } catch (err) {
              // fail silently
              console.error(err);
            }
          }
        );
      });
    });
  })
  .catch(err => {
    console.error(err);
  });

// auth middleware
const auth = jwt({
  secret,
  credentialsRequired: false
});

app.use(
  "/graphql",
  auth,
  bodyParser.json(),
  cors({ origin: "http://localhost:3000", credentials: false }),
  expressGraphQL(req => ({
    schema,
    context: {
      authenticatedUser: req.user
    },
    graphiql: false
  }))
);

app.use(express.static("public"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Express server is running...");
});

export default app;
