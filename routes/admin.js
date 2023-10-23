const express = require('express');
const route = express.Router();

// Validation middleware for the assignment

route.use("/students", require("./admin/students"));
route.use("/teachers", require("./admin/teachers"));
route.use("/libraries", require("./admin/library"));
route.use("/courses", require("./admin/courses"));
route.use("/products", require("./admin/products"));
route.use("/sales", require("./admin/sales"));


module.exports = route;



