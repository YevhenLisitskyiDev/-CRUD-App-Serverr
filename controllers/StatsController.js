const User = require("../models/UserModel");
const Profile = require("../models/ProfileModel");

const { handleError } = require("../utils/index");

const ageDiff = (birth) => {
  const [year, month, day] = birth.split("-");
  const birthDate = new Date(year, month - 1, day);
  const currentDate = new Date();
  const yearDiff = new Date(currentDate - birthDate);
  return yearDiff.getFullYear() - 1970;
};

const getAllStats = async (_, res) => {
  const users = await User.find();
  const profiles = await Profile.find();
  const profilesOverEighteen = profiles.filter(
    (profile) => ageDiff(profile.birthdate) >= 18
  ).length;

  res.status(200).json({
    users: users.length,
    profiles: profiles.length,
    profilesOverEighteen,
  });
};

module.exports = {
  getAllStats: handleError(getAllStats, "Something went wrong"),
};
