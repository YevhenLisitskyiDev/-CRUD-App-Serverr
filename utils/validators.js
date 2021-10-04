const { getDate } = require("./index");
const User = require("../models/UserModel");

const checkIsEmpty = (body) => {
  for (key in body) {
    if (key !== "__v" && body[key] === "") return `${key} can't be empty`;
  }
  return false;
};

const checkSameUser = async (user, id) => {
  for (key in user) {
    const sameKey = await User.find({ [key]: user[key] });
    if (sameKey.length && sameKey[0]._id.toString() !== id)
      return `User with this ${key} already exist`;
  }
  return false;
};

const emailValidator = (email) => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return emailRegex.exec(email);
};

const dateValidator = (date) => {
  const currentDate = new Date();
  if (getDate(date) > currentDate)
    return "Birthdate can't be later than current date";
  return false;
};

module.exports = { checkIsEmpty, checkSameUser, emailValidator, dateValidator };
