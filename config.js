exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       "mongodb://localhost/stress-app";

exports.PORT = process.env.PORT || 8080;

// need TEST_DATABASE_URL for integration testing
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                            "mongodb://localhost/stress-app";
