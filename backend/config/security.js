import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import passport from './passport.js';

// Limit request from same API
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});

// Limiter riêng, chặt hơn cho login
export const authLimiter = rateLimit({
  max: 10,                      
  windowMs: 15 * 60 * 1000,     
  message: 'Too many login attempts, please try again after 15 minutes.',
  standardHeaders: true,
  skipSuccessfulRequests: true, 
});

const applySecurityMiddleware = (app) => {
  // Set security HTTP Header
  app.use(helmet());

  // Rate limit cho các route /api
  app.use('/api', limiter);

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
