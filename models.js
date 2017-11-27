const mongoose = require("mongoose");

const stressorSchema = mongoose.Schema({
  stress: {
    type: String,
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  preHeartRate: {
    type: Number,
    required: true
  },
  postHeartRate: {
    type: Number,
    required: true
  }
});

stressorSchema.methods.apiRepr = function () {
  return {
    id: this._id,
    stress: this.stress,
    activity: this.activity,
    duration: this.duration,
    preHeartRate: this.preHeartRate,
    postHeartRate: this.postHeartRate
  };
};

const Stressor = mongoose.model("Stressor", stressorSchema);

module.exports = {Stressor};
