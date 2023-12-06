const express = require("express");
// require('dotenv').config()
const dot = require("dotenv");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const mongo = require("./services/mongo");
const { users } = require("./model/userModel");
const {
  CreateUser,
  FindUser,
  FindUserById,
} = require("./controller/userController");

dot.config();
const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.urlencoded({ extended: false }));

app.get("/home", (req, res) => {
  res.status(200).send({ message: "WELCOME TO PROJECT!!!!", status: true });
});

// const middleMan=(fn)=>{
//     return async function (req,res,next){

//     }
// }

app.post("/create", async (req, res) => {
  console.log(req.body);
  try {
    // const data = await users.create(req.body);
    const data = await CreateUser(req.body);
    res.status(200).send({ message: data, status: true });
  } catch (e) {
    res.status(404).send({ message: e, status: false });
  }
});

app.get("/getUsers", async (req, res) => {
  try {
    // const data = await users.create(req.body);
    const data = await FindUser();
    res.status(200).send({ message: data, status: true });
  } catch (e) {
    res.status(404).send({ message: e, status: false });
  }
});

app.get("/getUsersById/:id", async (req, res) => {
  try {
    // const data = await users.create(req.body);
    console.log(req.params.id);

    const data = await FindUserById(req.params.id);
    res
      .status(200)
      .send({ 
        message: data!=[] ? data : "user does not exist",
        status: data ? true : false,
      });
  } catch (e) {
    res.status(404).send({ message: e, status: false });
  }
});

app.all("/", (req, res) => {
  res.status(200).send({ message: "SERVER IS LIVE!!!", status: true });
});

app.all("*", (req, res) => {
  res.status(404).send({ message: "YOU ARE ON WRONG PATH", status: false });
});

mongo
  .MongoConnect()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `Server is running on PORT http://127.0.0.1:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log("we are getting error", error);
  });
