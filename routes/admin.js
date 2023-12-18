const express = require('express');
const route = express.Router();

route.use("/students", require("./admin/students"));
route.use("/teachers", require("./admin/teachers"));
route.use("/libraries", require("./admin/library"));
route.use("/courses", require("./admin/courses"));
route.use("/products", require("./admin/products"));
route.use("/sales", require("./admin/sales"));
route.use("/timetable", require("./admin/timetable"));


module.exports = route;



