import express from "express";
import mongoose from "mongoose";
import expressGraphQL from "express-graphql";
import bodyParser from "body-parser";
import schema from "./graphql";
import cors from "cors";
import Agenda from "agenda";
import { sendMessage } from "./utils/Nodemailer";
import { searchCraigslist } from "./utils/craigslist/postRetriever";

const app = express();

const mongURI = "mongodb://localhost:auth/SearchSender";
export const agenda = new Agenda();

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose
  .connect(mongURI)
  .then(() => {
    console.log("MongoDB connected");
    agenda.mongo(mongoose.connection, "jobs", () => {
      agenda.start();
      console.log("Agenda initialized");
      agenda.processEvery("30 seconds");
      console.log("Agenda pulling jobs every 30 seconds");

      agenda.define("send-email-to-user", { priority: "high" }, (job, done) => {
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
      });
    });
  })
  .catch(err => {
    console.error(err);
  });

app.use(bodyParser.json());
app.use(cors());
app.use(
  expressGraphQL({
    graphiql: false,
    schema
  })
);

app.listen(4000, () => {
  console.log("listening on 4000");
});

export default app;
