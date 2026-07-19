import express from 'express';
import {
  authUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  LogoutUser,
  registerUser,
  updateUser,
  updateUserProfile,
} from '../controller/userController';
import { admin, protect } from '../middleware/authMiddleware';
const router = express.Router();

router.route('/').get(protect, admin, getUsers).post(registerUser);

router.route('/logout').post(LogoutUser);
router.route('/login').post(authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
