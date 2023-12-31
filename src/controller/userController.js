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

const FindUsersByFilter = (filterBy, value) => {
  console.log(filterBy, value);
  return users.find({ email: "danush@gmail.com" });
};

const Auth = async (body) => {
  const user = await users.findOne({ email: body.email });
  if (user) {
    const res = await Comparing(body.password, user.password);
    console.log(res);
    if (res) return user;
    else throw new Error("password not matched");
  } else {
    throw new Error("user not found");
  }
};

const getStudentBySchoolID = async (id) => {
  const list = await users
    .aggregate([
      {
        $match: {
          schoolId: id,
        },
      },
      {
        $lookup: {
          from: "schools",
          localField: "schoolId",
          foreignField: "uid",
          as: "School Information",
        },
      },
      {
        $sort: { name: -1 },
      },
      {
        $project: {
          password: 0,
          _id: 0,
          __v: 0,
          "School Information._id": 0,
          "School Information.__v": 0,
        },
      },
    ])
    .exec();

  return list;
};

module.exports = {
  CreateUser,
  FindUser,
  FindUserById,
  Auth,
  FindUsersByFilter,
  getStudentBySchoolID,
};
