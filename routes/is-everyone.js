const express = require("express");
const path = require("path");

function sendFile(res, filename) {
    res.sendFile(path.join(__dirname+'/../public/'+filename));
}

module.exports = function(app) {

    app.get("/", (req, res) => sendFile(res, "index.html"));
    
}