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
} from '../controller/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import { loginSchema, registerSchema } from '../validator/userValidator.js';
import { validate, validateParams } from '../middleware/validateMiddleware.js';
import { mongoIdParamSchema } from '../validator/commonValidator.js';
const router = express.Router();

router
  .route('/')
  .get(protect, admin, getUsers)
  .post(validate(registerSchema), registerUser);

router.route('/register/verify').post(verifyUser);

router.route('/logout').post(LogoutUser);
router.route('/login').post(validate(loginSchema), loginUser);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route('/:id')
  .delete(protect, admin, validateParams(mongoIdParamSchema), deleteUser)
  .get(protect, admin, validateParams(mongoIdParamSchema), getUserById)
  .put(protect, admin, validateParams(mongoIdParamSchema), updateUser);

export default router;
