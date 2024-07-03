const sharp = require("sharp");
const { uploadSingleImage } = require("../utils/uploadImage");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = factory.getAll(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = factory.getOne(User);

exports.uploadUserPhoto = uploadSingleImage("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.png`;

  await sharp(req.file.buffer)
    // .resize(500, 500)
    .toFormat("png")
    .png({ quality: 98 })
    .toFile(`uploads/users/${req.file.filename}`);

  req.body.photo = `/users/${req.file.filename}`;

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ApiError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, "name", "email", "photo", "phone");
  if (req.body?.photo) {
    filteredBody.photo = req.body.photo;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new ApiError("Your current password is wrong", 401));
  }

  user.password = req.body.password;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});
