const Config = require("../models/configModel");
const catchAsync = require("../utils/catchAsync");

exports.getConfigs = catchAsync(async (req, res, next) => {
  const configs = await Config.find().select("key value -_id");

  res.status(200).json({
    status: "success",
    data: configs,
  });
});

exports.updateConfigs = catchAsync(async (req, res, next) => {
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);

  const promises = keys.map(async (key, index) => {
    const config = await Config.findOneAndUpdate(
      { key },
      { value: values[index] },
      { new: true }
    );
    return config;
  });

  const configs = await Promise.all(promises);

  res.status(200).json({
    status: "success",
    data: configs,
  });
});
