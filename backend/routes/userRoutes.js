import express from 'express';
import {
  loginUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  LogoutUser,
  registerUser,
  updateUser,
  updateUserProfile,
  verifyUser,
  loginWithFacebook,
  loginWithGoogle,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  forgotPassword,
  resetPassword,
} from '../controller/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validator/userValidator.js';
import { validate, validateParams } from '../middleware/validateMiddleware.js';
import { mongoIdParamSchema } from '../validator/commonValidator.js';
import passport from '../config/passport.js';
import { authLimiter } from '../config/security.js';

const router = express.Router();

router
  .route('/')
  .get(protect, admin, getUsers)
  .post(validate(registerSchema), registerUser);

router.route('/register/verify').post(authLimiter, verifyUser);

router.route('/logout').post(authLimiter, LogoutUser);
router.route('/login').post(authLimiter, validate(loginSchema), loginUser);
router
  .route('/forgot-password')
  .post(authLimiter, validate(forgotPasswordSchema), forgotPassword);
router
  .route('/reset-password')
  .post(authLimiter, validate(resetPasswordSchema), resetPassword);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route('/wishlist/:productId').delete(protect, removeFromWishlist);

router
  .route('/:id')
  .delete(protect, admin, validateParams(mongoIdParamSchema), deleteUser)
  .get(protect, admin, validateParams(mongoIdParamSchema), getUserById)
  .put(protect, admin, validateParams(mongoIdParamSchema), updateUser);

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'], session: false }),
);

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/login',
  }),
  loginWithFacebook,
);

router.route('/auth/google').get(
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
);

router.route('/auth/google/callback').get(
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login',
  }),
  loginWithGoogle,
);
export default router;
