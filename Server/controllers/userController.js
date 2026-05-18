import { generateToken } from "../lib/Utils1.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


export const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  if (!fullName || !email || !password || !bio) {
    return res.json({ success: false, message: "missing details" });
  }

  const user = await User.findOne({ email });

  if (user) {
    return res.json({ success: false, message: "account already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
    bio,
  });

  const token = generateToken(newUser._id);
  const userData = await User.findById(newUser._id).select("-password");

  res.json({
    success: true,
    userData,
    token,
    message: "Account created successfully",
  });
});

export const login = asyncHandler(async (req, res)=>{
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "missing details" });
    }

    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({ success: false, message: "invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "invalid credentials" });
    }

    const token = generateToken(userData._id);
    const safeUserData = await User.findById(userData._id).select("-password");

  res.json({
    success: true,
    userData: safeUserData,
    token,
    message: "Logged in successfully",
  });
})

export const checkAuth = asyncHandler(async(req,res)=>{
    res.json({success: true, user: req.user})
})

export const updateProfile = asyncHandler(async (req, res) => {
  const { profilePic, bio, fullName } = req.body;

  const userId = req.user._id;
  let updatedUser;

  // 🔹 If no profile pic → just update text fields
  if (!profilePic) {
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio, fullName },
      { new: true }
    );
  } 
  // 🔹 If profile pic exists → upload to Cloudinary
  else {
    const upload = await cloudinary.uploader.upload(profilePic);

    updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        bio,
        fullName,
        profilePic: upload.secure_url,
      },
      { new: true }
    );
  }

  res.json({
    success: true,
    user: updatedUser,
    message: "Profile updated successfully",
  });
});