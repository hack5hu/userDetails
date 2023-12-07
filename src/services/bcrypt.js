const { genSalt, hash, compare } = require("bcryptjs");

const BHashing = async (password) => {
  const salt = await genSalt(10);
  console.log("line 5",salt);
  const d = await hash(password, salt);
  console.log("line 7", d);
  return d;
};
const Comparing=(normalPass, backEndPass)=>{
        return compare(normalPass, backEndPass)
}
module.exports={BHashing, Comparing}