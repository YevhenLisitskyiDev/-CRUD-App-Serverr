const Profile = require("../models/ProfileModel");
const User = require("../models/UserModel");
const { handleError } = require("../utils/index");
const { checkIsEmpty, dateValidator } = require("../utils/validators");

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

  const validation = validateProfile(profileBody);
  if (validation) return res.status(400).json({ message: validation });

  const profile = new Profile({
    ...profileBody,
    user: id,
  });
  await profile.save();
  await addProfileToUser(id,profile._id);
  res.status(201).json({ message: "Profile Created", profile });
};

async function addProfileToUser(id, profileId) {
  await User.findByIdAndUpdate(id, {
    $push: {
      profiles: profileId,
    },
  });
}

const updateProfile = async (req, res) => {
  const { profileId } = req.params;
  const profileBody = req.body;

  const validation = validateProfile(profileBody);
  if (validation) return res.status(400).json({ message: validation });

  const profile = await Profile.findByIdAndUpdate(profileId, profileBody, {
    new: true,
  });
  if (!profile) return res.status(404).json({ message: "Profile not found" });
  res.status(200).json({
    message: "Profile Updated",
    profile,
  });
};

function validateProfile(profile) {
  const isEmpty = checkIsEmpty(profile);
  if (isEmpty) return isEmpty;

  const isDateInvalid = dateValidator(profile.birthdate);
  if (isDateInvalid) return isDateInvalid;

  return false;
}

const deleteProfile = async (req, res) => {
  const { profileId } = req.params;
  const profile = await Profile.findById(profileId);
  if (!profile) return res.status(404).json({ message: "Profile not found" });
  await Profile.deleteOne({ _id: profileId });
  await updateUserProfiles(profile.user, profileId);
  res.status(200).json({ message: "Profile Deleted" });
};

async function updateUserProfiles(id, profileId) {
  await User.findByIdAndUpdate(id, {
    $pull: {
      profiles: profileId,
    },
  });
}

module.exports = {
  getUserProfiles: handleError(getUserProfiles, "Can't get profiles"),
  getAllProfiles: handleError(getAllProfiles, "Can't get profiles"),
  createProfile: handleError(createProfile, "Can't create profile"),
  updateProfile: handleError(updateProfile, "Can't update profile"),
  deleteProfile: handleError(deleteProfile, "Can't delete profile"),
};
