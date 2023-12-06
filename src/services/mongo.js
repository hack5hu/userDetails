const mongo = require("mongoose");

const MongoConnect =async () => {
  console.log("Try to Connect with MongoDB ");

 await mongo
    .connect(process.env.MONGO_URL, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
    })
    .then((response) => {
    //   console.log(response);
    console.log("done!!")
    return true;
    })
    .catch((error) => {
      console.log(error);
        return error;
    });
  console.log("Connection Established!!!!");
  return true;
};
 
module.exports={MongoConnect}
