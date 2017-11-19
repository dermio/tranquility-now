const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");

const {app, runServer, closeServer} = require("../server");
const {Stressor} = require("../models");
const {TEST_DATABASE_URL, DATABASE_URL} = require("../config");

const should = chai.should();
chai.use(chaiHttp);


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
