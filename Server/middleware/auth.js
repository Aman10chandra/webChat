import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {asyncHandler} from "../utils/asyncHandler.js";

export const protectRoute = asyncHandler(async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    res.status(401);
    throw new Error("No token provided");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  req.user = user;

  next(); 
});