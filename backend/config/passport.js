import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../model/userModel.js';

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'emails'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });

        if (user) return done(null, user);

        const email =
          profile.emails?.[0]?.value || `fb_${profile.id}@proshop.com`;
        user = await User.findOne({ email });

        if (user) {
          user.facebookId = profile.id;
          await user.save();
          return done(null, user);
        }

        const newUser = await User.create({
          name: profile.displayName,
          email,
          facebookId: profile.id,
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

export default passport;
