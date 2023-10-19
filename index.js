const express = require("express");
const app = express();
const cors = require("cors");
const ConnectToMongo = require("./database");
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;

ConnectToMongo();
app.use(cors());
app.use(express.json()); // parsing body
app.use("/api/auth", require("./routes/auth"));
app.use("/api/activities", require("./routes/activities"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/attendances", require("./routes/attendances"));
app.use("/api/assignments", require("./routes/assignment"));
app.use("/api/marks", require("./routes/marks"));
app.use("/api/library", require("./routes/libraryItems"));



app.listen(port, () => {
  console.log(`IMS app listening at http://localhost:${port}`);
});
