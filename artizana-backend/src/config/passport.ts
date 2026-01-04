import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import User, { IUser } from '../models/User';

console.log('GOOGLE_CLIENT_ID loaded:', !!process.env.GOOGLE_CLIENT_ID ? 'YES' : 'NO');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
  proxy: true
}, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      if (profile.emails && profile.emails.length > 0) {
        user = await User.findOne({ email: profile.emails[0]!.value });
        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user as any);
        }
      }
    }
    if (!user) {
      const email = (profile.emails && profile.emails.length > 0) ? profile.emails[0]!.value : '';
      if (!email) {
        return done(new Error('No email found in Google profile'));
      }
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: email,
        role: null
      });
    }
    done(null, user as any);
  } catch (err) { done(err as Error); }
}));

passport.serializeUser((user: any, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try { done(null, await User.findById(id)); }
  catch (err) { done(err); }
});

export default passport;