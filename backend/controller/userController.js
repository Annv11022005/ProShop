import asyncHandler from '../middleware/asyncHandler.js';
import User from '../model/userModel.js';
import { generateToken } from '../utils/generateToken.js';

// @desc Auth user & get token
// POST /api/users/login
export const authUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
});

// @desc Register user
// POST /api/users
export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
});

// @desc Logout user & clear token
// POST /api/users/logout
export const LogoutUser = asyncHandler(async (req, res) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: true,
      expiresIn: new Date(0),
    });

    res.status(200).json({
      message: 'logged out successfully',
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
});

// @desc Get user profile
// GET /api/users/profile
// @access private
export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(401);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
});

// @desc Update  user profile
// PUT /api/users/profile
// @access private
export const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updateUser = await User.save();

      res.status(200).json({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        isAdmin: updateUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
});

// @desc Get users
// GET /api/users
// @access Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  res.send('Get users');
});

// @desc Get users by ID
// GET /api/users/:id
// @access Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  res.send('Get users by ID');
});

// @desc Delete users profile
// DELETE /api/users/:id
// @access Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  res.send('delete user');
});

// @desc Update User
// GET /api/users/:id
// @access Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  res.send('Update users');
});
