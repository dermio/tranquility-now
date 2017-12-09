const express = require("express");
const router = express.Router();

// Moved `bodyparser` and `bodyParser.json` inside the router module
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
// router.use(bodyParser.json());

const {Stressor} = require("./models");


/*
An alternaive is to use: const jsonParser = bodyParser.json().
Then I'd pass jsonParser as the middle arg to router.METHOD(PATH, HANDLER).
Example: router.post("/something", jsonParser, (req, res) => {...}).
In this case I don't use a bodyParser constant, because I'm using
router.use(bodyParser.json()) to make bodyParser available to all
route Methods.
*/

