import "reflect-metadata";
require("dotenv-safe").config();
import express from "express";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { join } from "path";
import { User } from "./entities/User";
import { Strategy as GitHubStrategy } from "passport-github";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Response } from "express-serve-static-core";
import cors from "cors";

(async () => {
  await createConnection({
    type: "postgres",
    database: "vsweather",
    username: "postgres",
    password: "postgres",
    entities: [join(__dirname, "./entities/*.*")],
    logging: !__prod__,
    synchronize: !__prod__,
  });

  //const user = await User.create({ name: "bob" }).save();
  //console.log(user);

  const app = express();

  passport.serializeUser((user: any, done) => {
    done(null, user.accessToken);
  });
  app.use(cors({ origin: "*" }));
  app.use(passport.initialize());

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3002/auth/github/callback",
      },
      async (_, __, profile, cb) => {
        let user = await User.findOne({ where: { githubId: profile.id } });
        if (user) {
          user.name = profile.displayName;
          await user.save();
        } else {
          user = await User.create({
            name: profile.displayName,
            githubId: profile.id,
          }).save();
        }

        cb(null, {
          accessToken: jwt.sign(
            { userId: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "1y",
            }
          ),
        });
      }
    )
  );

  app.get("/auth/github", passport.authenticate("github", { session: false }));

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    (req: any, res) => {
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    }
  );

  app.get("/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return nullUser(res);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return nullUser(res);
    }

    let userId = "";

    try {
      const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      userId = payload.userId;
    } catch (error) {
      return nullUser(res);
    }

    if (!userId) {
      return nullUser(res);
    }

    const user = await User.findOne(userId);
    res.send({ user });
  });

  app.get("/", (_req, res) => {
    res.send("hello");
  });

  app.listen(3002, () => {
    console.log("Listening on localhost:3002");
  });
})();

function nullUser(res: Response<any, Record<string, any>, number>) {
  res.send({ user: null });
  return;
}
