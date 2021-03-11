
var admin = require("firebase-admin");

var serviceAccount = require("../config/firebaseServiceAccountsKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ecommerce-4c8b6.firebaseio.com",
});

module.exports = admin;