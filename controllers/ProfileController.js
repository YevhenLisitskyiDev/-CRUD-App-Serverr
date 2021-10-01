const Profile = require("../models/ProfileModel");
const User = require("../models/UserModel");
const { handleError } = require("../utils/index");

const getUserProfiles = async (req, res) => {
  const profiles = await Profile.find({ user: req.params.id });
  res.status(200).send(profiles);
};

const getAllProfiles = async (_, res) => {
  const profiles = await Profile.find();
  res.status(200).send(profiles);
};

const createProfile = async (req, res) => {
  const { id } = req.params;
  const profileBody = req.body;
  const profile = new Profile({
    ...profileBody,
    user: id,
  });
  await profile.save();
  await User.findByIdAndUpdate(
    id,
    {
      $push: {
        profiles: profile._id,
      },
    },
    { new: true, useFindAndModify: false }
  );
  res.status(200).json({ message: "Profile Created", profile });
};

const updateProfile = async (req, res) => {
  const { profileId } = req.params;
  const profileBody = req.body;
  const profile = await Profile.findByIdAndUpdate(profileId, profileBody);
  if (!profile) return res.status(400).json({ message: "Profile not found" });
  res.status(200).json({
    message: "Profile Updated",
    profile: { ...profile._doc, ...profileBody },
  });
};

const deleteProfile = async (req, res) => {
  const { profileId } = req.params;
  const profile = await Profile.findById(profileId);
  if (!profile) return res.status(400).json({ message: "Profile not found" });
  await Profile.deleteOne({ _id: profileId });
  await User.findByIdAndUpdate(profile.user, {
    $pull: {
      profiles: profileId,
    },
  });
  res.status(200).json({ message: "Profile Deleted" });
};

module.exports = {
  getUserProfiles: handleError(getUserProfiles, "Can't get profiles"),
  getAllProfiles: handleError(getAllProfiles, "Can't get profiles"),
  createProfile: handleError(createProfile, "Something went wrong"),
  updateProfile: handleError(updateProfile, "Can't update profile"),
  deleteProfile: handleError(deleteProfile, "Can't delete profile"),
};
