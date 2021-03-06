const express = require("express");
const router = express.Router();

// Moved `bodyparser` and `bodyParser.json` inside the router module
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
// router.use(bodyParser.json());

const {Stressor} = require("./models");


/*
Use the Middleware function `body-parser` and call it with
`.json` to parse JSON from the request body.
Then pass this Middleware to only the POST and PUT requests.
JSON is sent as data from the client in POST and PUT requests.

Example: route to POST and PUT
const jsonParser = bodyParser.json();
router.post("/endpoint/:id", jsonParser, (req, res) => {...}).
router.post("/endpoint/:id", jsonParser, (req, res) => {...}).

Using: router.use(bodyParser.json()) is made availabe to
all requests methods in the router.
*/

// GET route
//router.get("/", function (req, res) {
router.get("/", function (req, res) {
  // console.log(res); // Why does the res look diff than log in Chai res?
  // res.send("GET request"); // this code works
  Stressor
    .find()
    .then(stressors => {
      // console.log(stressors); // stressors is an array of JSON docs
      res.json(stressors.map(stress => stress.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: "something went terribly wrong"});
    });
});

router.get("/:id", (req, res) => {
  Stressor
    .findById(req.params.id)
    .then(stressor => res.json(stressor.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: "something went horribly awry"})
    });
});

router.post("/", jsonParser, (req, res) => {
  let requiredFields = ["stress", "activity", "duration",
    "preHeartRate", "postHeartRate"];

  for (let i = 0; i < requiredFields.length; i++) {
    let field = requiredFields[i];
    if (!(field in req.body)) {
      let message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Stressor
    .create({
      stress: req.body.stress,
      activity: req.body.activity,
      duration: req.body.duration,
      preHeartRate: req.body.preHeartRate,
      postHeartRate: req.body.postHeartRate
    })
    .then(stressor => res.status(201).json(stressor.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: "Something went wrong"});
    });
});

router.put("/:id", jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  let updated = {};
  let updateableFields = ["stress", "activity", "duration",
    "preHeartRate", "postHeartRate"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Stressor
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .then(stressor => {
      // console.log(stressor); // the document with updated fields
      res.status(204).end(); // resp ends with send(), json(), or end()
    })
    .catch(err => res.status(500).json({message: "Something went wrong"}));
});

router.delete("/:id", (req, res) => {
  Stressor
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted stressor with id \`${req.params.id}\``);
      res.status(204).end(); // resp ends with send(), json(), or end()
    });
});

module.exports = router;
