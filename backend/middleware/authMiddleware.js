import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler';
import User from '../model/userModel';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  //Read the JWT from the cookie
  token.req.cookie.jwt;

  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.userID).select('-password');
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as admin');
  }
};
