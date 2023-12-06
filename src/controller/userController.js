const { users } = require("../model/userModel");

const CreateUser=(body)=>{
    return users.create(body)
}
const FindUser=()=>{
    return users.find({})
}
const FindUserById = (id) => {
  return users.find({uid:id});
};

module.exports = { CreateUser, FindUser, FindUserById };