import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import { VerifyCallback } from "passport-oauth2";
import pool from "./database.config";

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        console.log("Google OAuth callback for:", profile.emails?.[0]?.value);

        // בדוק אם המשתמש כבר קיים עם Google ID
        let result = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
          [profile.id]
        );

        if (result.rows.length > 0) {
          console.log("User found by Google ID");
          return done(null, result.rows[0]);
        }

        // בדוק אם קיים משתמש עם אותו email
        result = await pool.query("SELECT * FROM users WHERE email = $1", [
          profile.emails?.[0]?.value,
        ]);

        if (result.rows.length > 0) {
          console.log("User found by email, linking Google account");
          // עדכן משתמש קיים עם Google ID
          const updatedUser = await pool.query(
            "UPDATE users SET google_id = $1, provider = $2, avatar_url = $3 WHERE id = $4 RETURNING *",
            [
              profile.id,
              "google",
              profile.photos?.[0]?.value,
              result.rows[0].id,
            ]
          );
          return done(null, updatedUser.rows[0]);
        }

        console.log("Creating new user from Google");
        // צור משתמש חדש
        const names = profile.displayName?.split(" ") || ["", ""];
        const firstName = names[0] || "";
        const lastName = names.slice(1).join(" ") || "";

        const newUser = await pool.query(
          `INSERT INTO users (email, first_name, last_name, google_id, provider, avatar_url, user_type, phone) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [
            profile.emails?.[0]?.value,
            firstName,
            lastName,
            profile.id,
            "google",
            profile.photos?.[0]?.value,
            "buyer", // default
            "",
          ]
        );

        // צור פרופיל buyer אוטומטי
        if (newUser.rows[0].user_type === "buyer") {
          await pool.query(
            "INSERT INTO buyers (user_id, phone, city) VALUES ($1, $2, $3)",
            [newUser.rows[0].id, "", ""]
          );
        }

        console.log("New user created successfully");
        return done(null, newUser.rows[0]);
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error as Error, undefined);
      }
    }
  )
);

// JWT Strategy
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload: any, done: any) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [
        payload.userId,
      ]);
      if (result.rows.length > 0) {
        return done(null, result.rows[0]);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
