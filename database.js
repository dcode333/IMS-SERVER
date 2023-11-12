const mongoose = require("mongoose");
// process.env.MONGO_URL;
const url = 'mongodb+srv://admin-umair:test123@cluster0.xg387ne.mongodb.net/IMSSERVER' 
 

const ConnectToMongo = () => {
  mongoose.connect(url, {
    useNewUrlParser: true,
  })
    .then(() => {
      console.log("DB Connection Succesful");
    })
    .catch((e) => {
      console.log("Something went while connecting to DB: ", e);
    });
};

module.exports = ConnectToMongo;
