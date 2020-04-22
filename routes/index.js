const fs = require("fs");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const {
    passport
} = require("../Database");

module.exports = function (app) {

    app.use(session({
        secret: "dan's secret",
        saveUninitialized: true,
        resave: true
    }));
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    fs.readdirSync("./routes/").forEach(file => {
        if (file !== "index.js") {
            require("./" + file)(app);
        }
    });

}