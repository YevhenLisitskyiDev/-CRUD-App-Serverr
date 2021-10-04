const User = require("../models/UserModel");
const Profile = require("../models/ProfileModel");

const { handleError, getDate } = require("../utils/index");

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

function ageDiff(birth) {
  const birthDate = getDate(birth);
  const currentDate = new Date();
  const yearDiff = new Date(currentDate - birthDate);
  return yearDiff.getFullYear() - 1970;
}

module.exports = {
  getAllStats: handleError(getAllStats, "Something went wrong"),
};
