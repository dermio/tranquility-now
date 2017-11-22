const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const {PORT, DATABASE_URL} = require("./config");
const {Stressor} = require("./models");

const app = express();

app.use(morgan("common"));
app.use(bodyParser.json());
app.use(express.static("public"));
mongoose.Promise = global.Promise;


// GET route
//app.get("/", function (req, res) {
app.get("/stressors", function (req, res) {
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

app.get("/stressors/:id", (req, res) => {
  Stressor
    .findById(req.params.id)
    .then(stressor => res.json(stressor.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: "something went horribly awry"})
    });
});

app.post("/stressors", (req, res) => {
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

app.put("/stressors/:id", (req, res) => {
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
      res.status(204).end();
    })
    .catch(err => res.status(500).json({message: "Something went wrong"}));
});

app.delete("/stressors/:id", (req, res) => {
  Stressor
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted stressor with id \`${req.params.id}\``);
      res.status(204).end();
    });
});


// previous code to start the server
// app.listen(process.env.PORT || 8080);


// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
