const { users } = require("../model/userModel");
const { BHashing, Comparing } = require("../services/bcrypt");

const CreateUser = async (body) => {
  const pass = await BHashing(body.password);
  const body2 = {
    ...body,
    password: pass,
  };
  
  return users.create(body2);
};
const FindUser = () => {
  return users.find({});
};
const FindUserById = (id) => {
  return users.find({ uid: id });
};

const Auth = async (body) => {
  const user = await users.findOne({ email: body.email });
  if (user) {
    const res = await Comparing(body.password, user.password);
    console.log(res)
    if (res) return user;
    else throw new Error("password not matched");
  } else {
    throw new Error("user not found");
  }
};

module.exports = { CreateUser, FindUser, FindUserById, Auth };
