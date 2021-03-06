const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");

const {app, runServer, closeServer} = require("../server");
const {Stressor} = require("../models");
const {TEST_DATABASE_URL} = require("../config");

const should = chai.should();
chai.use(chaiHttp);


// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn("Deleting database");
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
}


// used to put randomish documents in db
// so we have data to work with and assert about.
// we insert this data into mongo
function seedStressorData() {
  console.info("seeding stressor data");
  let stress = ["break up", "job loss", "neighbor", "grief",
                "poor health", "neglect", "school", "financial",
                "drug abuse", "poor diet"];
  let activity = ["slow breathing", "soothing music", "writing",
                  "stretch", "yoga", "play instrument", "meditate",
                  "use guided imagery", "reading", "paint or draw"];

  let seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      stress: stress[Math.floor(Math.random() * 9)], // 0-9 index
      activity: activity[Math.floor(Math.random() * 9)], // 0-9 index
      duration: Math.floor(Math.random() * 10) + 1, // 1-10 minutes
      preHeartRate: Math.floor(Math.random() * 20) + 60, // 60-60 bpm
      postHeartRate: Math.floor(Math.random() * 20) + 60 // 60-80 bpm
    });
  }
  return Stressor.insertMany(seedData);
}


describe("stressors API resource", function () {
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return seedStressorData();
  });

  afterEach(function () {
    // tear down database so we ensure no state from this test
    // effects any coming after.
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  describe("test root url", function () {
    it("should return a status of 200", function () {
      return chai.request(app)
        .get("/")
        .then(function (res) {
          // console.log(res);
          res.should.have.status(200);
          res.should.be.html; // Is this correct? Or should I see HTML page?
        });
    });
  });

  describe("GET endpoint", function () {
    it("should return all existing stressors", function () {
      // `res` is a variable in a Scope accessible to
      // all then() function calls. It will be the response object
      let res;

      // Chai HTTP is a plugin for Chai. Chai uses Chai HTTP through
      // the command: chai.use(chaiHttp), line 10
      return chai.request(app)
        .get("/stressors") // get() available to Chai HTTP, in Node.js
        .then(function (_res) {
          res = _res;
          // console.log(res);
          res.should.have.status(200);
          res.body.should.have.length.of.at.least(1);
          return Stressor.count();
        })
        .then(function (count) {
          res.body.should.have.lengthOf(count);
        });
    });

    it("should return stressors with right fields", function () {
      // Get back all stressors, and make sure they have
      // the right keys and values.

      let resStressor;
      return chai.request(app)
        .get("/stressors")
        .then(function (res) {
          // console.log(res);
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("array");
          res.body.should.have.length.of.at.least(1);

          res.body.forEach(function (stressor) {
            stressor.should.be.a("object");
            // Use the keys in the returned object from the apiRepr method.
            // This is because the apiRepr method is called
            // in the GET request.
            stressor.should.include.keys("id", "stress",
              "activity", "duration", "preHeartRate", "postHeartRate");
          });

          // Check the Id for one of the stressors, then return that doc.
          // In the next .then() method, check the values
          // in the stressor document/object matches the database.
          resStressor = res.body[0];
          return Stressor.findById(resStressor.id);
        })
        // The `resStressor` is the response that's sent back to the Client.
        // In the GET request, the apiRepr method will send back
        // to the Client a representation of the stressor document
        // in the database, instead of the document itself.
        // The `stressor` is the actual document in the Mongo DB
        // found by the Mongoose command findById().
        .then(function (stressor) {
          // console.log(resStressor);
          // console.log(stressor);
          resStressor.id.should.equal(stressor.id);
          resStressor.stress.should.equal(stressor.stress);
          resStressor.activity.should.equal(stressor.activity);
          resStressor.duration.should.equal(stressor.duration);
          resStressor.preHeartRate.should.equal(stressor.preHeartRate);
        });
    });

    // NEXT, test GET request to: app.get("stressors/:id")
    // it("should return stressor with right id", function () {});

  });

  describe("POST endpoint", function () {
    // strategy: make a POST request with data,
    // then prove that the stressor we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)

    it("should add a new stressor", function () {
      let newStressor = {
        stress: "illness",
        activity: "yoga",
        duration: 9,
        preHeartRate: 68,
        postHeartRate: 58
      };

      return chai.request(app)
        .post("/stressors")
        .send(newStressor)
        .then(function (res) {
          // console.log(res);
          res.should.have.status(201);
          res.should.be.json;
          res.should.be.a("object");
          res.body.should.include.keys("id", "stress",
            "activity", "duration", "preHeartRate", "postHeartRate");
          res.body.activity.should.equal(newStressor.activity);
          // Mongo creates a new id when document is inserted into database
          res.body.id.should.not.be.null;
          // console.log(res.body.id); // alpha-numeric Id
          // console.log(newStressor.id); // undefined

          res.body.stress.should.equal(newStressor.stress);
          res.body.duration.should.equal(newStressor.duration);
          res.body.preHeartRate.should.equal(newStressor.preHeartRate);
          // Return a document from Mongo using Mongoose .findById()
          return Stressor.findById(res.body.id);
        })
        .then(function (stressor) { // stressor is a single doc from Mongo
          // console.log(stressor);
          stressor.stress.should.equal(newStressor.stress);
          stressor.activity.should.equal(newStressor.activity);
          stressor.duration.should.equal(newStressor.duration);
          stressor.postHeartRate.should.equal(newStressor.postHeartRate);
        });
    });
  });

  describe("PUT endpoint", function () {
    // strategy:
    //  1. Get an existing stressor from db
    //  2. Make a PUT request to update that post
    //  3. Prove post in db is correctly updated
    it("should update fields you send over", function () {
      let updateData = {
        stress: "work work boss boss",
        activity: "dream about Hawaii",
        duration: 10,
        preHeartRate: 59
      };

      return Stressor
        .findOne()
        .then(function (stressor) {
          updateData.id = stressor.id;
          // console.log(updateData.id);

          // make request then inspect it to make sure
          // it reflects the data that was sent
          return chai.request(app)
            .put(`/stressors/${stressor.id}`)
            .send(updateData);
        })
        .then(function (res) {
          res.should.have.status(204);
          // returns the document with correct Id
          return Stressor.findById(updateData.id);
        })
        .then(function (stressor) {
          // stressor is the returned document from Mongo
          // with the updated values
          // console.log(stressor);
          stressor.stress.should.equal(updateData.stress);
          stressor.activity.should.equal(updateData.activity);
          stressor.duration.should.equal(updateData.duration);
          stressor.preHeartRate.should.equal(updateData.preHeartRate);
        });
    });
  });

  describe("DELETE endpoint", function () {
    // strategy:
    //  1. get a stressor
    //  2. make a DELETE request for that stressor's id
    //  3. assert that response has right status code
    //  4. prove that stressor with the id doesn't exist in db anymore
    it("should delete a stressor by id", function () {
      let stressor;

      return Stressor
        .findOne()
        // _stressor is an existing document in Mongo returned by findOne()
        .then(function (_stressor) {
          stressor = _stressor;
          // make a DELETE request with the id
          return chai.request(app).delete(`/stressors/${stressor.id}`);
        })
        .then(function (res) { // res sent by DELETE request
          res.should.have.status(204);
          // stressor is a copy of the document before it was deleted,
          // on line 253. This should return undefined or null.
          // console.log(stressor);
          return Stressor.findById(stressor.id);
        })
        .then(function (_stressor) {
          // console.log(_stressor);
          // _stressor was returned from the previous .then() method.
          // It should have a value of undefined or null,
          // because that document and id no longer exist.
          should.not.exist(_stressor);

          // Note: cannot extend null or undefined with should,
          // because they are not proper objects.
          // null.should.not.exist is NOT a valid statement
          // This works: (_post === null).should.be.true
        });
    });
  });

});