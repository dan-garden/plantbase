const express = require("express");

module.exports = function(app) {
    app.use('/assets', express.static("public/assets"));
}