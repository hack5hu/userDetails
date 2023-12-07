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
  Auth,
} = require("./controller/userController");
const Joi = require("joi");
const session = require("express-session");
const MongoStore = require("connect-mongo");
dot.config();
const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL_SESSION,
      collectionName: "sessions/cookies",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.get("/home", (req, res) => {
  res.status(200).send({ message: "WELCOME TO PROJECT!!!!", status: true });
});

app.post("/create", async (req, res) => {
  // console.log(req.body);
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      name: Joi.string().min(2).required(),
      password: Joi.string().max(20).min(8).required(),
      age: Joi.number().max(99).min(10),
    });
    const validatedData = await schema.validateAsync(req.body);
    console.log(validatedData);
    // const data = await users.create(req.body);
    const data = await CreateUser(req.body);
    res.status(200).send({ message: data, status: true });
  } catch (e) {
    res.status(404).send({ message: e, status: false });
  }
});

app.post("/login", async (req, res) => {
  // console.log(req.body);
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const validatedData = await schema.validateAsync(req.body);
    console.log(validatedData);
    // const data = await users.create(req.body);
    const data = await Auth(req.body);
    req.session.user = data;
    res
      .status(200)
      .send({ data: data, status: true, message: "login Successfully" });
  } catch (e) {
    res.status(404).send({ message: e.message, status: false });
  }
});

app.get("/getUsers", async (req, res) => {
  try {
    // const data = await users.create(req.body);
    const data = await FindUser();
    res.status(200).send({ message: data, status: true });
  } catch (e) {
    console.log(e);
    res.status(404).send({ message: e, status: false });
  }
});

app.get("/getUsersById/:id", async (req, res) => {
  try {
    let data
    if (req.session && req.session.user) {
      if (req.params.id === req.session.user.uid) {
      data = await FindUserById(req.params.id);
      } else
        throw new Error(
          "unauthenticated user, trying to access another account"
        );
    } else throw new Error("user is not logged in. please login first");

    res.status(200).send({
      message: data,
      status: true,
    });
  } catch (e) {
    res.status(404).send({ message: e.message, status: false });
  }
});

app.post('/logout',(req, res)=>{
  try {
    req.session.destroy(()=>{})
    res.status(200).send({
      message: 'user is logged out successfullyyy!!!!!!!!!!',
      status: true,
    });
  } catch (e) {
    res.status(404).send({ message: e.message, status: false });
  }
})

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
