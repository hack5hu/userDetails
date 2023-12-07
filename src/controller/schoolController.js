const { default: mongoose } = require("mongoose");
const { schools } = require("../model/schoolModel")


const CreateSchool=(body)=>{
    return schools.create(body)
}

const getSchool=async()=>{
    const list = await schools
      .aggregate([
        // {
        //   $match: {
        //     _id: new mongoose.Types.ObjectId("6571b9207026f37c8b21272c"),
        //   },
        // },
        {
          $lookup: {
            from: "users",
            localField: "stdtId",
            foreignField: "uid",
            as: "Students",
          },
        },
      ])
      .exec();
    console.log(list)
    return list
}

module.exports = { CreateSchool, getSchool };