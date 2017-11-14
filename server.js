const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(morgan("common"));
app.use(express.static("public"));
mongoose.Promise = global.Promise;

app.listen(process.env.PORT || 8080);

module.exports = {app};