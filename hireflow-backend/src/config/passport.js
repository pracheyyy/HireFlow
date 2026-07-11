const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Existing user - link Google provider if they signed up with email first
          if (user.provider === "local") {
            user.provider = "google";
            await user.save();
          }
          return done(null, user);
        }

        // First-time Google login - create the user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos?.[0]?.value || "",
          provider: "google",
          isVerified: true, // Google already verified the email
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Not using persistent sessions (JWT-based), but passport requires these
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
