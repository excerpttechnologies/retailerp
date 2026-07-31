const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');

// @desc  Login (shared by super admin and company users)
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() })
    .select('+password +refreshToken')
    .populate('role')
    .populate('company');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (user.status !== 'active') {
    res.status(403);
    throw new Error('Your account is inactive. Contact your administrator.');
  }

  if (!user.isSuperAdmin && user.company && user.company.status !== 'active') {
    res.status(403);
    throw new Error(`Company account is ${user.company.status}. Contact support.`);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isSuperAdmin: user.isSuperAdmin,
      company: user.company,
      role: user.role,
    },
  });
});

// @desc  Refresh access token using refresh token cookie
// @route POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    res.status(401);
    throw new Error('Refresh token missing');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    res.status(401);
    throw new Error('Refresh token invalid or expired');
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    res.status(401);
    throw new Error('Refresh token does not match');
  }

  const accessToken = generateAccessToken(user._id);
  res.json({ success: true, accessToken });
});

// @desc  Logout - clears refresh token
// @route POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await User.updateOne({ refreshToken: token }, { $unset: { refreshToken: 1 } });
  }
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

// @desc  Get current logged-in user profile
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { login, refresh, logout, getMe };
