const User = require("../models/UserModel");
const Profile = require("../models/ProfileModel");

const {
  handleError,
  generateToken,
  generateHashedPassword,
  verifyPassword,
} = require("../utils");
const {
  checkIsEmpty,
  checkSameUser,
  emailValidator,
} = require("../utils/validators");

const getUserById = async (req, res) => {
  let user = await User.findById(req.params.id).populate("profiles");
  if (!user) return res.status(404).json({ message: "User not found" });
  user.password = undefined;
  res.status(200).json(user);
};

const getAllUsers = async (_, res) => {
  let users = await User.find();
  users = users.map((user) => ({
    ...user._doc,
    password: undefined,
    profilesCount: user.profiles.length,
  }));
  res.status(200).send(users);
};

const createUser = async (req, res) => {
  const userBody = req.body;

  const validation = await validateUser(userBody);
  if (validation) return res.status(400).json({ message: validation });

  const hashedPassword = await generateHashedPassword(userBody.password);
  const user = new User({
    ...userBody,
    password: hashedPassword,
    profiles: [],
  });
  await user.save();
  const token = generateToken({ id: user._id, isAdmin: user.isAdmin });
  res.status(201).json({ message: "User Created", user, token });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const userBody = req.body;

  const validation = await validateUser(userBody, id);
  if (validation) return res.status(400).json({ message: validation });

  const user = await User.findByIdAndUpdate(id, userBody, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({
    message: "User Updated",
    user,
  });
};

async function validateUser(user, id){
  const isUserEmpty = checkIsEmpty(user);
  if (isUserEmpty) return isUserEmpty;

  const { username, email } = user;
  const isUserAlreadyExist = await checkSameUser({ username, email }, id);
  if (isUserAlreadyExist) return isUserAlreadyExist;

  const emailValidation = emailValidator(email);
  if (!emailValidation) return "Email don't valid";

  return false;
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  await User.deleteOne({ _id: id });
  for (const profile of user.profiles) {
    await Profile.deleteOne({ _id: profile._id });
  }
  res.status(200).json({ message: "User Deleted" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate("profiles");
  if (!user) return res.status(400).json({ message: "User not found" });

  const isPasswordRight = await verifyPassword(password, user.password);
  if (isPasswordRight) {
    const token = generateToken({ id: user._id, isAdmin: user.isAdmin });
    return res.status(200).json({ user: user._doc, token });
  } else return res.status(400).json({ message: "Password is incorrect" });
};

const authUser = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findOne({ _id: userId }).populate("profiles");
  if (!user) return res.status(400).json({ message: "User not found" });
  const token = generateToken({ id: user._id, isAdmin: user.isAdmin });
  return res.status(200).json({ user: user._doc, token });
};

module.exports = {
  getUserById: handleError(getUserById, "Something went wrong"),
  getAllUsers: handleError(getAllUsers, "Something went wrong"),
  createUser: handleError(createUser, "Something went wrong"),
  loginUser: handleError(loginUser, "Something went wrong"),
  authUser: handleError(authUser, "Something went wrong"),
  updateUser: handleError(updateUser, "Can't update user"),
  deleteUser: handleError(deleteUser, "Can't delete user"),
};
