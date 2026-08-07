import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import passport from './passport.js';

// Limit request from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many request from this IP, please try again in an hour!',
// });

const applySecurityMiddleware = (app) => {
  // Set security HTTP Header
  app.use(helmet());

  // Rate limit cho các route /api
  // app.use('/api', limiter);

  // Data sanitize against NoSQL query injection
  app.use(ExpressMongoSanitize());

  // Data sanitization against XSS
  app.use(xss());

  // Prevent parameter pollution
  app.use(
    hpp({
      whitelist: ['price', 'rating'],
    }),
  );

  // Cookie parser middleware
  app.use(cookieParser());

  // Passport
  app.use(passport.initialize());
};

export default applySecurityMiddleware;
