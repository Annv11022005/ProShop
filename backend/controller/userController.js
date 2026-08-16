import transporter from '../config/mailer.js';
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../model/userModel.js';
import { generateToken } from '../utils/generateToken.js';
import generateOTP from '../utils/generateOTP.js';

// @desc Auth user & get token
// POST /api/users/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error('Account not verified. Please verify your email first.');
  }

  generateToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  });
});

// @desc Register user
// POST /api/users
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const otp = generateOTP();
  const otpExpires = Date.now() + 5 * 60 * 1000;

  const user = await User.create({
    name,
    email,
    password,
    otp,
    otpExpires,
  });

  if (user) {
    generateToken(res, user._id);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Account registration confirmation code',
      text: `Hello ${user.name},\n\nYour One-Time Password (OTP) is: ${otp}\n\nThis code will expire in 5 minutes. Please do not share this code with anyone.\n\nBest regards.`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (err) {
      console.log('Error sending email:', err);
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc Verify OTP
// POST /api/register/verify
export const verifyUser = asyncHandler(async (req, res) => {
  const { otp, email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.otp !== otp) {
    res.status(400);
    throw new Error('Invalid OTP!');
  }

  if (Date.now() > user.otpExpires) {
    res.status(400);
    throw new Error('OTP has expired');
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// @desc login with facebook
export const loginWithFacebook = asyncHandler(async (req, res) => {
  generateToken(res, req.user._id);

  const userData = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
  };

  const encodedUser = encodeURIComponent(JSON.stringify(userData));
  res.redirect(`http://localhost:5173?authUser=${encodedUser}`);
});

// @desc login with google
export const loginWithGoogle = asyncHandler(async (req, res) => {
  generateToken(res, req.user._id);

  const userData = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
  };

  const encodedUser = encodeURIComponent(JSON.stringify(userData));
  res.redirect(`http://localhost:5173?authUser=${encodedUser}`);
});

// @desc Logout user & clear token
// POST /api/users/logout
export const LogoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: 'logged out successfully',
  });
});

// @desc Get user profile
// GET /api/users/profile
// @access private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    });
  } else {
    res.status(401);
    throw new Error('User not found');
  }
});

// @desc Update  user profile
// PUT /api/users/profile
// @access private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updateUser = await user.save();

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Get users
// GET /api/users
// @access Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.status(200).json(users);
});

// @desc Get users by ID
// GET /api/users/:id
// @access Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Delete users profile
// DELETE /api/users/:id
// @access Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }

    await user.deleteOne({ _id: user._id });
    res.status(200).json({ message: 'user deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Update User
// GET /api/users/:id
// @access Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updateUser = await user.save();

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
